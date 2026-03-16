import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Region, Camera } from 'react-native-maps';
import * as Location from 'expo-location';
import { colors } from '@/constants/Colors';
import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE, OPENWEATHER_API_KEY } from '@/utils/constants';
import { usePermissions } from '@/hooks/usePermissions';
import { useAltitude } from '@/hooks/useAltitude';
import { useCompass } from '@/hooks/useCompass';
import { useHorizonDistance } from '@/hooks/useHorizonDistance';
import { useSettings } from '@/hooks/useSettings';
import { useVisibility } from '@/hooks/useVisibility';
import { AltitudeStepper } from '@/components/AltitudeStepper';
import { CompassWidget } from '@/components/CompassWidget';
import { HorizonCircle } from '@/components/HorizonCircle';
import { HeadingCone } from '@/components/HeadingCone';
import { VisibilityCircle } from '@/components/VisibilityCircle';
import { PermissionGate } from '@/components/PermissionGate';

export default function MapScreen() {
  const { locationGranted, loading: permLoading, requestLocation } = usePermissions();
  const { imperial, toggleUnit } = useSettings();
  const {
    altitude,
    source,
    gpsAvailable,
    barometerAvailable,
    loading: altitudeLoading,
    increment,
    decrement,
    resetToGps,
    setManual,
  } = useAltitude(locationGranted);
  const compass = useCompass();
  const horizon = useHorizonDistance(altitude);

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [mapRef, setMapRef] = useState<MapView | null>(null);
  const [mapHeading, setMapHeading] = useState(0);

  const { visibilityKm } = useVisibility(
    userLocation?.latitude ?? null,
    userLocation?.longitude ?? null,
    OPENWEATHER_API_KEY
  );

  // Track map rotation so we know when to show the compass button
  const onRegionChange = useCallback((_region: Region, details: { isGesture?: boolean }) => {
    if (mapRef) {
      mapRef.getCamera().then((camera: Camera) => {
        setMapHeading(camera.heading ?? 0);
      });
    }
  }, [mapRef]);

  // Fetch user location for map centering
  useEffect(() => {
    if (!locationGranted) return;

    Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    }).then((loc) => {
      setUserLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    }).catch(() => {});
  }, [locationGranted]);

  // Show permission gate on first launch
  if (permLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.skyBlue} />
      </View>
    );
  }

  if (locationGranted !== true) {
    return (
      <PermissionGate onRequestPermission={requestLocation}>
        <></>
      </PermissionGate>
    );
  }

  const center = userLocation ?? {
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAULT_LONGITUDE,
  };

  // Calculate a reasonable map delta to show the full circle
  const horizonDegrees = horizon.km / 111; // rough km-to-degrees
  const delta = Math.max(horizonDegrees * 2.5, 0.01);

  const initialRegion: Region = {
    latitude: center.latitude,
    longitude: center.longitude,
    latitudeDelta: delta,
    longitudeDelta: delta,
  };

  const recenter = () => {
    if (mapRef && userLocation) {
      mapRef.animateToRegion(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: delta,
          longitudeDelta: delta,
        },
        300
      );
    }
  };

  const rotateToNorth = () => {
    if (mapRef) {
      mapRef.animateCamera({ heading: 0 }, { duration: 400 });
    }
  };

  // Map is considered "rotated" when heading is more than 5 degrees from north
  const mapRotated = Math.abs(mapHeading) > 5 && Math.abs(mapHeading - 360) > 5;

  // Visibility circle radius in meters (capped to horizon)
  const visibilityMeters = visibilityKm !== null
    ? Math.min(visibilityKm * 1000, horizon.meters)
    : null;

  return (
    <View style={styles.container}>
      <MapView
        ref={(ref) => setMapRef(ref)}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
        showsCompass={false}
        mapPadding={{ top: 0, right: 0, bottom: 180, left: 0 }}
        onRegionChangeComplete={onRegionChange}
      >
        <HorizonCircle
          latitude={center.latitude}
          longitude={center.longitude}
          radiusMeters={horizon.meters}
        />
        {visibilityMeters !== null && visibilityMeters < horizon.meters && (
          <VisibilityCircle
            latitude={center.latitude}
            longitude={center.longitude}
            radiusMeters={visibilityMeters}
          />
        )}
        {userLocation && (
          <HeadingCone
            latitude={userLocation.latitude}
            longitude={userLocation.longitude}
            heading={compass.heading}
            available={compass.available}
          />
        )}
      </MapView>

      {/* Top bar overlay */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          {/* Heading readout */}
          {compass.available && (
            <View style={styles.headingPill}>
              <Text style={styles.headingText}>
                {Math.round(compass.heading)}°
              </Text>
            </View>
          )}
        </View>
        <Pressable style={styles.unitToggle} onPress={toggleUnit}>
          <Text style={styles.unitToggleText}>
            {imperial ? 'ft / mi' : 'm / km'}
          </Text>
        </Pressable>
      </View>

      {/* Right side buttons */}
      <View style={styles.rightButtons}>
        {/* Compass north button — only shows when map is rotated */}
        <CompassWidget
          heading={mapHeading}
          available={compass.available}
          mapRotated={mapRotated}
          onPress={rotateToNorth}
        />

        {/* Recenter button */}
        {userLocation && (
          <Pressable style={styles.recenterButton} onPress={recenter}>
            <Text style={styles.recenterText}>⌖</Text>
          </Pressable>
        )}
      </View>

      {/* Bottom sheet */}
      <View style={styles.bottomSheet}>
        <AltitudeStepper
          altitude={altitude}
          horizonKm={horizon.km}
          imperial={imperial}
          source={source}
          loading={altitudeLoading}
          onIncrement={increment}
          onDecrement={decrement}
          onResetGps={resetToGps}
          onSetManual={setManual}
          gpsAvailable={gpsAvailable}
          barometerAvailable={barometerAvailable}
          compassAvailable={compass.available}
          visibilityKm={visibilityKm}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.deepNavy,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBarLeft: {
    flexDirection: 'row',
    gap: 8,
  },
  headingPill: {
    backgroundColor: colors.deepNavy + 'CC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  headingText: {
    color: colors.softWhite,
    fontSize: 14,
    fontWeight: '600',
  },
  unitToggle: {
    backgroundColor: colors.deepNavy + 'CC',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  unitToggleText: {
    color: colors.softWhite,
    fontSize: 14,
    fontWeight: '600',
  },
  rightButtons: {
    position: 'absolute',
    right: 16,
    bottom: 200,
    gap: 8,
    alignItems: 'center',
  },
  recenterButton: {
    backgroundColor: colors.deepNavy + 'CC',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recenterText: {
    color: colors.softWhite,
    fontSize: 20,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
