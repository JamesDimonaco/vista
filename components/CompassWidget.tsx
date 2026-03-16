import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '@/constants/Colors';
import { headingToCardinal } from '@/utils/calculations';

interface Props {
  heading: number;
  available: boolean;
  onPress?: () => void;
}

export function CompassWidget({ heading, available, onPress }: Props) {
  if (!available) return null;

  const cardinal = headingToCardinal(heading);

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.circle}>
        {/* Compass needle */}
        <View
          style={[
            styles.needleContainer,
            { transform: [{ rotate: `${-heading}deg` }] },
          ]}
        >
          <View style={styles.needleNorth} />
          <View style={styles.needleSouth} />
        </View>
        <Text style={styles.northLabel}>N</Text>
      </View>
      <Text style={styles.bearingText}>
        {cardinal} {Math.round(heading)}°
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
  },
  circle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.slate,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.mutedGrey + '40',
  },
  needleContainer: {
    position: 'absolute',
    width: 4,
    height: 32,
    alignItems: 'center',
  },
  needleNorth: {
    width: 4,
    height: 16,
    backgroundColor: colors.amber,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  needleSouth: {
    width: 4,
    height: 16,
    backgroundColor: colors.mutedGrey,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  northLabel: {
    position: 'absolute',
    top: 2,
    color: colors.amber,
    fontSize: 8,
    fontWeight: '700',
  },
  bearingText: {
    color: colors.softWhite,
    fontSize: 12,
    fontWeight: '500',
  },
});
