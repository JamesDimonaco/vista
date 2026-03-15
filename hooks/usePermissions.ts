import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

interface PermissionState {
  locationGranted: boolean | null; // null = not yet requested
  loading: boolean;
  requestLocation: () => Promise<boolean>;
}

export function usePermissions(): PermissionState {
  const [locationGranted, setLocationGranted] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkExisting();
  }, []);

  async function checkExisting() {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setLocationGranted(status === 'granted');
    } catch {
      setLocationGranted(false);
    } finally {
      setLoading(false);
    }
  }

  async function requestLocation(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setLocationGranted(granted);
      return granted;
    } catch {
      setLocationGranted(false);
      return false;
    }
  }

  return { locationGranted, loading, requestLocation };
}
