import { useEffect, useState } from 'react';

const OPENWEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

interface VisibilityState {
  visibilityKm: number | null;
  loading: boolean;
}

export function useVisibility(
  latitude: number | null,
  longitude: number | null,
  apiKey: string | null
): VisibilityState {
  const [visibilityKm, setVisibilityKm] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!latitude || !longitude || !apiKey) return;

    let mounted = true;
    setLoading(true);

    async function fetchVisibility() {
      try {
        const url = `${OPENWEATHER_API_URL}?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
        const res = await fetch(url);
        if (!res.ok) return;

        const data = await res.json();
        // OpenWeatherMap returns visibility in meters (max 10000)
        if (mounted && data.visibility !== undefined) {
          setVisibilityKm(data.visibility / 1000);
        }
      } catch {
        // Silently fail — visibility is optional
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchVisibility();

    return () => {
      mounted = false;
    };
  }, [latitude, longitude, apiKey]);

  return { visibilityKm, loading };
}
