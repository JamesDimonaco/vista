import React, { useRef, useCallback, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Keyboard,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/Colors';
import {
  formatDistance,
  getAltitudeDisplayValue,
  displayValueToMeters,
  roundToStep,
} from '@/utils/calculations';
import { LONG_PRESS_INTERVAL_MS, ALTITUDE_MIN, ALTITUDE_MAX } from '@/utils/constants';

interface Props {
  altitude: number; // meters
  horizonKm: number;
  imperial: boolean;
  source: 'gps' | 'barometer' | 'manual';
  loading: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onResetGps: () => void;
  onSetManual: (meters: number) => void;
  gpsAvailable: boolean;
  barometerAvailable: boolean;
  compassAvailable: boolean;
  visibilityKm: number | null;
}

export function AltitudeStepper({
  altitude,
  horizonKm,
  imperial,
  source,
  loading,
  onIncrement,
  onDecrement,
  onResetGps,
  onSetManual,
  gpsAvailable,
  barometerAvailable,
  compassAvailable,
  visibilityKm,
}: Props) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

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

  const startEditing = () => {
    setEditValue(String(displayValue));
    setEditing(true);
  };

  const submitEdit = () => {
    const parsed = parseInt(editValue, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      const meters = displayValueToMeters(roundToStep(parsed), imperial);
      const clamped = Math.max(ALTITUDE_MIN, Math.min(ALTITUDE_MAX, meters));
      onSetManual(clamped);
    }
    setEditing(false);
    Keyboard.dismiss();
  };

  const cancelEdit = () => {
    setEditing(false);
    Keyboard.dismiss();
  };

  // Format visibility for display
  const visibilityText = visibilityKm !== null
    ? formatDistance(visibilityKm, imperial)
    : null;

  return (
    <View style={styles.container}>
      <View style={styles.distanceRow}>
        <View>
          <Text style={styles.distanceLabel}>Distance to horizon</Text>
          {visibilityText && (
            <Text style={styles.visibilityLabel}>Visibility today</Text>
          )}
        </View>
        <View style={styles.distanceValues}>
          <Text style={styles.distanceValue}>{distanceText}</Text>
          {visibilityText && (
            <Text style={styles.visibilityValue}>{visibilityText}</Text>
          )}
        </View>
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

        <Pressable style={styles.altitudeDisplay} onPress={startEditing}>
          {editing ? (
            <View style={styles.editRow}>
              <TextInput
                style={styles.editInput}
                value={editValue}
                onChangeText={setEditValue}
                keyboardType="number-pad"
                autoFocus
                selectTextOnFocus
                onSubmitEditing={submitEdit}
                onBlur={cancelEdit}
                returnKeyType="done"
              />
              <Text style={styles.altitudeUnit}>{unitLabel}</Text>
            </View>
          ) : (
            <>
              <Text style={styles.altitudeValue}>{displayValue}</Text>
              <Text style={styles.altitudeUnit}>{unitLabel}</Text>
            </>
          )}
        </Pressable>

        <Pressable
          style={styles.stepButton}
          onPress={() => handlePress(onIncrement)}
          onLongPress={() => startLongPress(onIncrement)}
          onPressOut={stopLongPress}
        >
          <Text style={styles.stepButtonText}>+ 10</Text>
        </Pressable>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.sensorRow}>
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={colors.skyBlue} />
              <Text style={styles.loadingText}>Detecting altitude...</Text>
            </View>
          ) : (
            <>
              <SensorDot label="GPS" active={gpsAvailable} />
              <SensorDot label="Barometer" active={barometerAvailable} />
              <SensorDot label="Compass" active={compassAvailable} />
            </>
          )}
        </View>
        {source === 'manual' && gpsAvailable && !loading && (
          <Pressable style={styles.resetButton} onPress={onResetGps}>
            <Text style={styles.resetText}>Reset to GPS</Text>
          </Pressable>
        )}
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
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  distanceLabel: {
    color: colors.mutedGrey,
    fontSize: 14,
  },
  distanceValues: {
    alignItems: 'flex-end',
  },
  distanceValue: {
    color: colors.skyBlue,
    fontSize: 20,
    fontWeight: '600',
  },
  visibilityLabel: {
    color: colors.mutedGrey,
    fontSize: 12,
    marginTop: 2,
  },
  visibilityValue: {
    color: colors.amber,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
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
  editRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  editInput: {
    color: colors.softWhite,
    fontSize: 32,
    fontWeight: '700',
    minWidth: 80,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.skyBlue,
    paddingVertical: 0,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sensorRow: {
    flexDirection: 'row',
    gap: 16,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: colors.skyBlue,
    fontSize: 12,
  },
  resetButton: {
    backgroundColor: colors.slate,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  resetText: {
    color: colors.skyBlue,
    fontSize: 12,
    fontWeight: '600',
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
