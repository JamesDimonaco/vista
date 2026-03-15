import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '@/constants/Colors';

interface Props {
  onRequestPermission: () => void;
  children: React.ReactNode;
}

export function PermissionGate({ onRequestPermission, children }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Vista</Text>
        <Text style={styles.subtitle}>See how far your world reaches.</Text>
        <Text style={styles.description}>
          Vista uses your location to determine your position and altitude, then
          calculates how far you can see from where you stand.
        </Text>
        <Text style={styles.privacy}>
          Your location stays on your device. Nothing is sent anywhere.
        </Text>
        <Pressable style={styles.button} onPress={onRequestPermission}>
          <Text style={styles.buttonText}>Enable Location</Text>
        </Pressable>
        <Pressable onPress={() => {}}>
          <Text style={styles.skipText}>Continue without location</Text>
        </Pressable>
      </View>
      {children}
    </View>
  );
}

export function PermissionDenied() {
  return (
    <View style={styles.deniedBanner}>
      <Text style={styles.deniedText}>
        Location unavailable — using manual altitude only
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.deepNavy,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  content: {
    alignItems: 'center',
    gap: 16,
  },
  title: {
    color: colors.softWhite,
    fontSize: 40,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.skyBlue,
    fontSize: 18,
    fontWeight: '500',
  },
  description: {
    color: colors.mutedGrey,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  privacy: {
    color: colors.mutedGrey,
    fontSize: 13,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: colors.skyBlue,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  buttonText: {
    color: colors.deepNavy,
    fontSize: 16,
    fontWeight: '700',
  },
  skipText: {
    color: colors.mutedGrey,
    fontSize: 14,
    marginTop: 4,
  },
  deniedBanner: {
    backgroundColor: colors.slate,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deniedText: {
    color: colors.mutedGrey,
    fontSize: 12,
    textAlign: 'center',
  },
});
