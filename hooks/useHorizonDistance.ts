import { useMemo } from 'react';
import { horizonDistanceKm, kmToMeters } from '@/utils/calculations';

interface HorizonDistance {
  km: number;
  meters: number;
}

export function useHorizonDistance(altitudeMeters: number): HorizonDistance {
  return useMemo(() => {
    const km = horizonDistanceKm(altitudeMeters);
    return {
      km,
      meters: kmToMeters(km),
    };
  }, [altitudeMeters]);
}
