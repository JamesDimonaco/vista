import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { colors } from '@/constants/Colors';
import { useSettings } from '@/hooks/useSettings';
import { useCompass } from '@/hooks/useCompass';
import { usePermissions } from '@/hooks/usePermissions';

export default function SettingsScreen() {
  const { unit, toggleUnit } = useSettings();
  const compass = useCompass();
  const { locationGranted } = usePermissions();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Units */}
      <Text style={styles.sectionTitle}>Units</Text>
      <View style={styles.card}>
        <Pressable style={styles.option} onPress={toggleUnit}>
          <View style={styles.optionRow}>
            <Text style={styles.optionText}>Metric (m, km)</Text>
            <View
              style={[
                styles.radio,
                unit === 'metric' && styles.radioSelected,
              ]}
            />
          </View>
        </Pressable>
        <View style={styles.divider} />
        <Pressable style={styles.option} onPress={toggleUnit}>
          <View style={styles.optionRow}>
            <Text style={styles.optionText}>Imperial (ft, mi)</Text>
            <View
              style={[
                styles.radio,
                unit === 'imperial' && styles.radioSelected,
              ]}
            />
          </View>
        </Pressable>
      </View>

      {/* Sensors */}
      <Text style={styles.sectionTitle}>Sensors</Text>
      <View style={styles.card}>
        <SensorRow label="GPS Location" available={locationGranted === true} />
        <View style={styles.divider} />
        <SensorRow label="Compass" available={compass.available} />
      </View>

      {/* How it works */}
      <Text style={styles.sectionTitle}>How it works</Text>
      <View style={styles.card}>
        <Text style={styles.explanationText}>
          Vista calculates the geometric distance to the horizon using your
          altitude. The formula accounts for the curvature of the Earth and
          standard atmospheric refraction.
        </Text>
        <Text style={styles.formulaText}>
          d = √(2 × R × h × k)
        </Text>
        <Text style={styles.explanationText}>
          Where R is Earth's radius (6,371 km), h is your height, and k is the
          refraction correction factor (1.17).
        </Text>
      </View>

      {/* About */}
      <Text style={styles.sectionTitle}>About</Text>
      <View style={styles.card}>
        <Text style={styles.optionText}>Vista v1.0.0</Text>
        <Text style={[styles.explanationText, { marginTop: 8 }]}>
          Your location stays on your device. No data is collected or sent
          anywhere.
        </Text>
      </View>
    </ScrollView>
  );
}

function SensorRow({
  label,
  available,
}: {
  label: string;
  available: boolean;
}) {
  return (
    <View style={styles.optionRow}>
      <Text style={styles.optionText}>{label}</Text>
      <View style={styles.statusRow}>
        <Text style={[styles.statusText, available ? styles.statusAvailable : styles.statusUnavailable]}>
          {available ? 'Available' : 'Unavailable'}
        </Text>
        <View
          style={[
            styles.dot,
            available ? styles.dotActive : styles.dotInactive,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.deepNavy,
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  sectionTitle: {
    color: colors.mutedGrey,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: 24,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: colors.slate,
    borderRadius: 12,
    padding: 16,
  },
  option: {
    paddingVertical: 4,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  optionText: {
    color: colors.softWhite,
    fontSize: 16,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.mutedGrey,
  },
  radioSelected: {
    borderColor: colors.skyBlue,
    backgroundColor: colors.skyBlue,
  },
  divider: {
    height: 1,
    backgroundColor: colors.deepNavy,
    marginVertical: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
  },
  statusAvailable: {
    color: colors.emerald,
  },
  statusUnavailable: {
    color: colors.mutedGrey,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: colors.emerald,
  },
  dotInactive: {
    backgroundColor: colors.mutedGrey,
  },
  explanationText: {
    color: colors.mutedGrey,
    fontSize: 14,
    lineHeight: 20,
  },
  formulaText: {
    color: colors.skyBlue,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 12,
    fontFamily: 'SpaceMono',
  },
});
