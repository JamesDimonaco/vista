import React from 'react';
import { Circle } from 'react-native-maps';
import { colors } from '@/constants/Colors';
import { MAP_CIRCLE_STROKE_WIDTH } from '@/utils/constants';

interface Props {
  latitude: number;
  longitude: number;
  radiusMeters: number;
}

export function HorizonCircle({ latitude, longitude, radiusMeters }: Props) {
  if (radiusMeters <= 0) return null;

  return (
    <Circle
      center={{ latitude, longitude }}
      radius={radiusMeters}
      fillColor={colors.circleFill}
      strokeColor={colors.circleStroke}
      strokeWidth={MAP_CIRCLE_STROKE_WIDTH}
    />
  );
}
