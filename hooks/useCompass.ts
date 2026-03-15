import { useEffect, useState, useRef } from 'react';
import { Magnetometer } from 'expo-sensors';
import { magnetometerToHeading } from '@/utils/calculations';
import { COMPASS_SMOOTHING_ALPHA } from '@/utils/constants';

interface CompassState {
  heading: number; // 0-360, 0 = North
  available: boolean;
}

export function useCompass(): CompassState {
  const [heading, setHeading] = useState(0);
  const [available, setAvailable] = useState(false);
  const smoothedRef = useRef(0);

  useEffect(() => {
    let subscription: ReturnType<typeof Magnetometer.addListener> | null = null;

    async function start() {
      try {
        const isAvailable = await Magnetometer.isAvailableAsync();
        setAvailable(isAvailable);

        if (!isAvailable) return;

        Magnetometer.setUpdateInterval(100);

        subscription = Magnetometer.addListener((data) => {
          const raw = magnetometerToHeading(data.x, data.y);

          // Low-pass filter to smooth jitter
          // Handle the 360→0 wraparound
          let diff = raw - smoothedRef.current;
          if (diff > 180) diff -= 360;
          if (diff < -180) diff += 360;

          const smoothed = (smoothedRef.current + COMPASS_SMOOTHING_ALPHA * diff + 360) % 360;
          smoothedRef.current = smoothed;
          setHeading(Math.round(smoothed));
        });
      } catch {
        setAvailable(false);
      }
    }

    start();

    return () => {
      subscription?.remove();
    };
  }, []);

  return { heading, available };
}
