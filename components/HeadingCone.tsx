import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';

interface Props {
  latitude: number;
  longitude: number;
  heading: number;
  available: boolean;
}

export function HeadingCone({ latitude, longitude, heading, available }: Props) {
  if (!available) return null;

  return (
    <Marker
      coordinate={{ latitude, longitude }}
      anchor={{ x: 0.5, y: 0.5 }}
      flat
      tracksViewChanges={false}
    >
      <View style={styles.wrapper}>
        <View
          style={[
            styles.rotator,
            { transform: [{ rotate: `${heading}deg` }] },
          ]}
        >
          {/* Google Maps-style beam: layered arcs for gradient effect */}
          <View style={styles.beamOuter} />
          <View style={styles.beamMiddle} />
          <View style={styles.beamInner} />
        </View>
      </View>
    </Marker>
  );
}

const BEAM_SIZE = 100;
const CENTER = BEAM_SIZE / 2;

const styles = StyleSheet.create({
  wrapper: {
    width: BEAM_SIZE,
    height: BEAM_SIZE,
  },
  rotator: {
    width: BEAM_SIZE,
    height: BEAM_SIZE,
    alignItems: 'center',
  },
  beamOuter: {
    position: 'absolute',
    top: 0,
    left: CENTER - 36,
    width: 0,
    height: 0,
    borderLeftWidth: 36,
    borderRightWidth: 36,
    borderBottomWidth: CENTER,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(56, 189, 248, 0.08)',
  },
  beamMiddle: {
    position: 'absolute',
    top: 6,
    left: CENTER - 26,
    width: 0,
    height: 0,
    borderLeftWidth: 26,
    borderRightWidth: 26,
    borderBottomWidth: CENTER - 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(56, 189, 248, 0.12)',
  },
  beamInner: {
    position: 'absolute',
    top: 14,
    left: CENTER - 16,
    width: 0,
    height: 0,
    borderLeftWidth: 16,
    borderRightWidth: 16,
    borderBottomWidth: CENTER - 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(56, 189, 248, 0.18)',
  },
});
