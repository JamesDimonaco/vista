import React, { useRef, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/Colors';
import { formatDistance, getAltitudeDisplayValue } from '@/utils/calculations';
import { LONG_PRESS_INTERVAL_MS } from '@/utils/constants';

interface Props {
  altitude: number; // meters
  horizonKm: number;
  imperial: boolean;
  source: 'gps' | 'barometer' | 'manual';
  onIncrement: () => void;
  onDecrement: () => void;
  gpsAvailable: boolean;
  barometerAvailable: boolean;
  compassAvailable: boolean;
}

export function AltitudeStepper({
  altitude,
  horizonKm,
  imperial,
  source,
  onIncrement,
  onDecrement,
  gpsAvailable,
  barometerAvailable,
  compassAvailable,
}: Props) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handlePress = useCallback(
    (action: () => void) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      action();
    },
    []
  );

  const startLongPress = useCallback(
    (action: () => void) => {
      intervalRef.current = setInterval(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        action();
      }, LONG_PRESS_INTERVAL_MS);
    },
    []
  );

  const stopLongPress = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const displayValue = getAltitudeDisplayValue(altitude, imperial);
  const unitLabel = imperial ? 'ft' : 'm';
  const distanceText = formatDistance(horizonKm, imperial);

  return (
    <View style={styles.container}>
      <View style={styles.distanceRow}>
        <Text style={styles.distanceLabel}>Distance to horizon</Text>
        <Text style={styles.distanceValue}>{distanceText}</Text>
      </View>

      <View style={styles.stepperRow}>
        <Pressable
          style={styles.stepButton}
          onPress={() => handlePress(onDecrement)}
          onLongPress={() => startLongPress(onDecrement)}
          onPressOut={stopLongPress}
        >
          <Text style={styles.stepButtonText}>− 10</Text>
        </Pressable>

        <View style={styles.altitudeDisplay}>
          <Text style={styles.altitudeValue}>{displayValue}</Text>
          <Text style={styles.altitudeUnit}>{unitLabel}</Text>
        </View>

        <Pressable
          style={styles.stepButton}
          onPress={() => handlePress(onIncrement)}
          onLongPress={() => startLongPress(onIncrement)}
          onPressOut={stopLongPress}
        >
          <Text style={styles.stepButtonText}>+ 10</Text>
        </Pressable>
      </View>

      <View style={styles.sensorRow}>
        <SensorDot label="GPS" active={gpsAvailable} />
        <SensorDot label="Barometer" active={barometerAvailable} />
        <SensorDot label="Compass" active={compassAvailable} />
      </View>
    </View>
  );
}

function SensorDot({ label, active }: { label: string; active: boolean }) {
  return (
    <View style={styles.sensorItem}>
      <View style={[styles.dot, active ? styles.dotActive : styles.dotInactive]} />
      <Text style={styles.sensorLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.deepNavy,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  distanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  distanceLabel: {
    color: colors.mutedGrey,
    fontSize: 14,
  },
  distanceValue: {
    color: colors.skyBlue,
    fontSize: 20,
    fontWeight: '600',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stepButton: {
    backgroundColor: colors.slate,
    borderRadius: 12,
    width: 72,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepButtonText: {
    color: colors.softWhite,
    fontSize: 16,
    fontWeight: '600',
  },
  altitudeDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  altitudeValue: {
    color: colors.softWhite,
    fontSize: 32,
    fontWeight: '700',
  },
  altitudeUnit: {
    color: colors.mutedGrey,
    fontSize: 16,
  },
  sensorRow: {
    flexDirection: 'row',
    gap: 16,
  },
  sensorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: colors.emerald,
  },
  dotInactive: {
    backgroundColor: colors.mutedGrey,
  },
  sensorLabel: {
    color: colors.mutedGrey,
    fontSize: 12,
  },
});
