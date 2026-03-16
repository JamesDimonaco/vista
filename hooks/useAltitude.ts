import { useEffect, useState, useCallback, useRef } from 'react';
import * as Location from 'expo-location';
import { Barometer } from 'expo-sensors';
import { roundToStep } from '@/utils/calculations';
import { ALTITUDE_STEP, ALTITUDE_MIN, ALTITUDE_MAX } from '@/utils/constants';

type AltitudeSource = 'gps' | 'barometer' | 'manual';

interface AltitudeState {
  altitude: number; // always in meters, always a multiple of ALTITUDE_STEP
  source: AltitudeSource;
  gpsAvailable: boolean;
  barometerAvailable: boolean;
  loading: boolean;
  increment: () => void;
  decrement: () => void;
  setManual: (meters: number) => void;
  resetToGps: () => void;
}

export function useAltitude(locationGranted: boolean | null): AltitudeState {
  const [altitude, setAltitude] = useState(0);
  const [source, setSource] = useState<AltitudeSource>('manual');
  const [gpsAvailable, setGpsAvailable] = useState(false);
  const [barometerAvailable, setBarometerAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const gpsAltitudeRef = useRef<number>(0);

  // Check barometer availability
  useEffect(() => {
    Barometer.isAvailableAsync().then(setBarometerAvailable).catch(() => setBarometerAvailable(false));
  }, []);

  // Get GPS altitude when location is granted
  useEffect(() => {
    if (!locationGranted) return;

    let mounted = true;

    async function fetchGpsAltitude() {
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        if (!mounted) return;

        const alt = location.coords.altitude;
        if (alt !== null && alt !== undefined) {
          const rounded = Math.max(ALTITUDE_MIN, roundToStep(alt));
          gpsAltitudeRef.current = rounded;
          setGpsAvailable(true);
          // Only set from GPS if user hasn't manually adjusted
          setAltitude((prev) => {
            if (prev === 0) {
              setSource('gps');
              return rounded;
            }
            return prev;
          });
        }
      } catch {
        if (mounted) setGpsAvailable(false);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchGpsAltitude();

    return () => {
      mounted = false;
    };
  }, [locationGranted]);

  const increment = useCallback(() => {
    setAltitude((prev) => {
      const next = prev + ALTITUDE_STEP;
      return next <= ALTITUDE_MAX ? next : prev;
    });
    setSource('manual');
  }, []);

  const decrement = useCallback(() => {
    setAltitude((prev) => {
      const next = prev - ALTITUDE_STEP;
      return next >= ALTITUDE_MIN ? next : prev;
    });
    setSource('manual');
  }, []);

  const setManual = useCallback((meters: number) => {
    const clamped = Math.max(ALTITUDE_MIN, Math.min(ALTITUDE_MAX, roundToStep(meters)));
    setAltitude(clamped);
    setSource('manual');
  }, []);

  const resetToGps = useCallback(() => {
    if (gpsAvailable) {
      setAltitude(gpsAltitudeRef.current);
      setSource('gps');
    }
  }, [gpsAvailable]);

  return {
    altitude,
    source,
    gpsAvailable,
    barometerAvailable,
    loading,
    increment,
    decrement,
    setManual,
    resetToGps,
  };
}
