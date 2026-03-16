import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '@/constants/Colors';

interface Props {
  heading: number;
  available: boolean;
  mapRotated: boolean;
  onPress?: () => void;
}

export function CompassWidget({ heading, available, mapRotated, onPress }: Props) {
  // Only show when the map has been rotated away from north
  if (!available || !mapRotated) return null;

  return (
    <Pressable style={styles.button} onPress={onPress}>
      <View
        style={[
          styles.needleContainer,
          { transform: [{ rotate: `${-heading}deg` }] },
        ]}
      >
        <View style={styles.needleNorth} />
        <View style={styles.needleSouth} />
      </View>
      <Text style={styles.label}>N</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.deepNavy + 'CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  needleContainer: {
    position: 'absolute',
    width: 4,
    height: 24,
    alignItems: 'center',
  },
  needleNorth: {
    width: 4,
    height: 12,
    backgroundColor: colors.amber,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  needleSouth: {
    width: 4,
    height: 12,
    backgroundColor: colors.mutedGrey + '80',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  label: {
    position: 'absolute',
    bottom: 2,
    color: colors.amber,
    fontSize: 8,
    fontWeight: '700',
  },
});
