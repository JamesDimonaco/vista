import { useEffect, useState, useRef } from 'react';

export interface Landmark {
  id: string;
  name: string;
  type: 'peak' | 'city' | 'town' | 'village' | 'viewpoint' | 'landmark';
  latitude: number;
  longitude: number;
  elevation?: number; // meters, if available
  distanceKm: number;
}

interface LandmarksState {
  landmarks: Landmark[];
  loading: boolean;
}

const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

// Calculate distance between two coordinates in km (haversine)
function haversineKm(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function classifyPlace(tags: Record<string, string>): Landmark['type'] {
  if (tags.natural === 'peak') return 'peak';
  if (tags.tourism === 'viewpoint') return 'viewpoint';
  if (tags.place === 'city') return 'city';
  if (tags.place === 'town') return 'town';
  if (tags.place === 'village') return 'village';
  return 'landmark';
}

export function useLandmarks(
  latitude: number | null,
  longitude: number | null,
  radiusKm: number
): LandmarksState {
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [loading, setLoading] = useState(false);
  const lastFetchRef = useRef<string>('');

  useEffect(() => {
    if (!latitude || !longitude || radiusKm <= 0) return;

    // Don't refetch if position hasn't moved significantly (0.01 degree ~1km)
    const key = `${latitude.toFixed(2)},${longitude.toFixed(2)},${Math.round(radiusKm)}`;
    if (key === lastFetchRef.current) return;
    lastFetchRef.current = key;

    let mounted = true;
    setLoading(true);

    async function fetchLandmarks() {
      try {
        // Cap the search radius to 50km to keep Overpass queries fast
        const searchRadius = Math.min(radiusKm, 50) * 1000; // meters

        // Overpass QL query: peaks, cities, towns, villages, viewpoints within radius
        const query = `
          [out:json][timeout:10];
          (
            node["natural"="peak"](around:${searchRadius},${latitude},${longitude});
            node["place"~"city|town|village"](around:${searchRadius},${latitude},${longitude});
            node["tourism"="viewpoint"](around:${searchRadius},${latitude},${longitude});
          );
          out body 60;
        `;

        const res = await fetch(OVERPASS_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `data=${encodeURIComponent(query)}`,
        });

        if (!res.ok || !mounted) return;

        const data = await res.json();

        const results: Landmark[] = (data.elements ?? [])
          .filter((el: any) => el.tags?.name)
          .map((el: any) => ({
            id: String(el.id),
            name: el.tags.name,
            type: classifyPlace(el.tags),
            latitude: el.lat,
            longitude: el.lon,
            elevation: el.tags.ele ? parseFloat(el.tags.ele) : undefined,
            distanceKm: haversineKm(latitude!, longitude!, el.lat, el.lon),
          }))
          .sort((a: Landmark, b: Landmark) => a.distanceKm - b.distanceKm);

        if (mounted) setLandmarks(results);
      } catch {
        // Silently fail — landmarks are optional
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchLandmarks();

    return () => { mounted = false; };
  }, [latitude, longitude, radiusKm]);

  return { landmarks, loading };
}
