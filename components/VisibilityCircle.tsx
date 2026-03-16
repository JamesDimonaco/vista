import React from 'react';
import { Circle } from 'react-native-maps';
import { colors } from '@/constants/Colors';
import { MAP_CIRCLE_STROKE_WIDTH } from '@/utils/constants';

interface Props {
  latitude: number;
  longitude: number;
  radiusMeters: number;
}

export function VisibilityCircle({ latitude, longitude, radiusMeters }: Props) {
  if (radiusMeters <= 0) return null;

  return (
    <Circle
      center={{ latitude, longitude }}
      radius={radiusMeters}
      fillColor="rgba(245, 158, 11, 0.08)"
      strokeColor="rgba(245, 158, 11, 0.50)"
      strokeWidth={MAP_CIRCLE_STROKE_WIDTH}
    />
  );
}
