import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { colors } from '@/constants/Colors';
import { formatDistance } from '@/utils/calculations';
import type { Landmark } from '@/hooks/useLandmarks';

interface Props {
  landmarks: Landmark[];
  imperial: boolean;
}

const ICON_MAP: Record<Landmark['type'], string> = {
  peak: '▲',
  city: '●',
  town: '●',
  village: '·',
  viewpoint: '◉',
  landmark: '◆',
};

const COLOR_MAP: Record<Landmark['type'], string> = {
  peak: colors.amber,
  city: colors.softWhite,
  town: colors.softWhite,
  village: colors.mutedGrey,
  viewpoint: colors.skyBlue,
  landmark: colors.emerald,
};

export function LandmarkMarkers({ landmarks, imperial }: Props) {
  return (
    <>
      {landmarks.map((lm) => (
        <Marker
          key={lm.id}
          coordinate={{ latitude: lm.latitude, longitude: lm.longitude }}
          anchor={{ x: 0.5, y: 0.5 }}
          tracksViewChanges={false}
        >
          <View style={styles.markerContainer}>
            <Text style={[styles.markerIcon, { color: COLOR_MAP[lm.type] }]}>
              {ICON_MAP[lm.type]}
            </Text>
          </View>
          <Callout tooltip>
            <View style={styles.callout}>
              <Text style={styles.calloutName}>{lm.name}</Text>
              <View style={styles.calloutDetails}>
                <Text style={styles.calloutType}>{lm.type}</Text>
                <Text style={styles.calloutDistance}>
                  {formatDistance(lm.distanceKm, imperial)}
                </Text>
              </View>
              {lm.elevation !== undefined && (
                <Text style={styles.calloutElevation}>
                  {imperial
                    ? `${Math.round(lm.elevation / 0.3048)} ft`
                    : `${Math.round(lm.elevation)} m`
                  } elevation
                </Text>
              )}
            </View>
          </Callout>
        </Marker>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerIcon: {
    fontSize: 14,
    fontWeight: '700',
  },
  callout: {
    backgroundColor: colors.deepNavy,
    borderRadius: 10,
    padding: 12,
    minWidth: 140,
    maxWidth: 220,
  },
  calloutName: {
    color: colors.softWhite,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  calloutDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calloutType: {
    color: colors.mutedGrey,
    fontSize: 12,
    textTransform: 'capitalize',
  },
  calloutDistance: {
    color: colors.skyBlue,
    fontSize: 13,
    fontWeight: '600',
  },
  calloutElevation: {
    color: colors.mutedGrey,
    fontSize: 12,
    marginTop: 4,
  },
});
