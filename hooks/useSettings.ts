import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UNIT_KEY = 'vista_unit_preference';

export type UnitSystem = 'metric' | 'imperial';

interface SettingsState {
  unit: UnitSystem;
  imperial: boolean;
  toggleUnit: () => void;
  loading: boolean;
}

export function useSettings(): SettingsState {
  const [unit, setUnit] = useState<UnitSystem>('metric');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(UNIT_KEY)
      .then((value) => {
        if (value === 'imperial') setUnit('imperial');
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleUnit = useCallback(() => {
    setUnit((prev) => {
      const next = prev === 'metric' ? 'imperial' : 'metric';
      AsyncStorage.setItem(UNIT_KEY, next);
      return next;
    });
  }, []);

  return {
    unit,
    imperial: unit === 'imperial',
    toggleUnit,
    loading,
  };
}
