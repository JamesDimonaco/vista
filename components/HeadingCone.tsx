import React from 'react';
import { Polygon } from 'react-native-maps';

interface Props {
  latitude: number;
  longitude: number;
  heading: number; // degrees, 0 = north
  available: boolean;
}

// Draw a cone/wedge showing the user's facing direction
export function HeadingCone({ latitude, longitude, heading, available }: Props) {
  if (!available) return null;

  // Cone parameters
  const coneLength = 0.004; // ~400m in degrees — visual only, not to scale
  const coneSpread = 20; // degrees either side of heading

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  // Calculate cone points
  const leftAngle = toRad(heading - coneSpread);
  const rightAngle = toRad(heading + coneSpread);

  // Points: user position, left edge, right edge
  const points = [
    { latitude, longitude },
    {
      latitude: latitude + coneLength * Math.cos(leftAngle),
      longitude: longitude + coneLength * Math.sin(leftAngle),
    },
    {
      latitude: latitude + coneLength * Math.cos(rightAngle),
      longitude: longitude + coneLength * Math.sin(rightAngle),
    },
  ];

  return (
    <Polygon
      coordinates={points}
      fillColor="rgba(56, 189, 248, 0.20)"
      strokeColor="rgba(56, 189, 248, 0.40)"
      strokeWidth={1}
    />
  );
}
