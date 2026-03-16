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

      {/* Visibility */}
      <Text style={styles.sectionTitle}>Visibility today</Text>
      <View style={styles.card}>
        <Text style={styles.explanationText}>
          The blue circle on the map shows how far you could see on a perfectly
          clear day — based purely on your altitude and the curvature of the Earth.
        </Text>
        <Text style={[styles.explanationText, { marginTop: 10 }]}>
          The amber circle shows how far you can actually see right now, based on
          current weather conditions at your location. Fog, rain, haze, and
          humidity all reduce visibility.
        </Text>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: colors.skyBlue }]} />
          <Text style={styles.legendText}>Theoretical maximum (clear sky)</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: colors.amber }]} />
          <Text style={styles.legendText}>Actual visibility (current weather)</Text>
        </View>
        <Text style={[styles.explanationText, { marginTop: 10 }]}>
          When both circles are shown, the area between them represents what you
          could see on a clearer day but can't see right now.
        </Text>
        <Text style={[styles.explanationText, { marginTop: 10 }]}>
          If the amber circle isn't shown, either the weather is clear enough that
          visibility isn't limiting you, or weather data isn't available.
        </Text>
      </View>

      {/* Landmarks */}
      <Text style={styles.sectionTitle}>Landmarks</Text>
      <View style={styles.card}>
        <Text style={styles.explanationText}>
          Vista shows nearby points of interest within your horizon range,
          pulled from OpenStreetMap. These include:
        </Text>
        <View style={styles.legendRow}>
          <Text style={[styles.legendIcon, { color: colors.amber }]}>▲</Text>
          <Text style={styles.legendText}>Mountain peaks (with elevation)</Text>
        </View>
        <View style={styles.legendRow}>
          <Text style={[styles.legendIcon, { color: colors.softWhite }]}>●</Text>
          <Text style={styles.legendText}>Cities and towns</Text>
        </View>
        <View style={styles.legendRow}>
          <Text style={[styles.legendIcon, { color: colors.skyBlue }]}>◉</Text>
          <Text style={styles.legendText}>Viewpoints</Text>
        </View>
        <Text style={[styles.explanationText, { marginTop: 10 }]}>
          Tap any landmark on the map to see its name, type, distance from you,
          and elevation (if available). Use the ▲ button in the top bar to
          toggle landmarks on or off.
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
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendIcon: {
    fontSize: 14,
    fontWeight: '700',
    width: 16,
    textAlign: 'center',
  },
  legendText: {
    color: colors.softWhite,
    fontSize: 14,
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
