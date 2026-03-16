import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker, Polygon } from 'react-native-maps';
import { colors } from '@/constants/Colors';

interface Props {
  latitude: number;
  longitude: number;
  heading: number; // degrees, 0 = north
  available: boolean;
}

export function HeadingCone({ latitude, longitude, heading, available }: Props) {
  if (!available) return null;

  // Cone on the map (visible when zoomed in)
  const coneLength = 0.004;
  const coneSpread = 20;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const leftAngle = toRad(heading - coneSpread);
  const rightAngle = toRad(heading + coneSpread);

  const conePoints = [
    { latitude, longitude },
    {
      latitude: latitude + coneLength * Math.cos(leftAngle),
      longitude: longitude + coneLength * Math.sin(leftAngle),
    },
    {
      latitude: latitude + coneLength * Math.cos(rightAngle),
      longitude: longitude + coneLength * Math.sin(rightAngle),
    },
  ];

  return (
    <>
      {/* Cone visible when zoomed in */}
      <Polygon
        coordinates={conePoints}
        fillColor="rgba(56, 189, 248, 0.20)"
        strokeColor="rgba(56, 189, 248, 0.40)"
        strokeWidth={1}
      />
      {/* Arrow marker visible at all zoom levels */}
      <Marker
        coordinate={{ latitude, longitude }}
        anchor={{ x: 0.5, y: 0.5 }}
        flat
        tracksViewChanges={false}
      >
        <View style={[
          styles.arrowContainer,
          { transform: [{ rotate: `${heading}deg` }] },
        ]}>
          <View style={styles.arrow} />
        </View>
      </Marker>
    </>
  );
}

const styles = StyleSheet.create({
  arrowContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.skyBlue,
    opacity: 0.9,
  },
});
