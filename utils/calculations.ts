import {
  EFFECTIVE_RADIUS_KM,
  METERS_PER_FOOT,
  KM_PER_MILE,
  ALTITUDE_STEP,
} from './constants';

/**
 * Calculate the distance to the horizon from a given altitude.
 * Uses the geometric formula with atmospheric refraction correction.
 *
 * d = sqrt(2 * R_eff * h)
 *
 * where R_eff = Earth radius * refraction factor
 */
export function horizonDistanceKm(altitudeMeters: number): number {
  if (altitudeMeters <= 0) return 0;
  const altitudeKm = altitudeMeters / 1000;
  return Math.sqrt(2 * EFFECTIVE_RADIUS_KM * altitudeKm);
}

/** Convert km to meters */
export function kmToMeters(km: number): number {
  return km * 1000;
}

/** Convert meters to feet */
export function metersToFeet(meters: number): number {
  return meters / METERS_PER_FOOT;
}

/** Convert feet to meters */
export function feetToMeters(feet: number): number {
  return feet * METERS_PER_FOOT;
}

/** Convert km to miles */
export function kmToMiles(km: number): number {
  return km / KM_PER_MILE;
}

/** Round to nearest step (default 10) */
export function roundToStep(value: number, step: number = ALTITUDE_STEP): number {
  return Math.round(value / step) * step;
}

/** Format distance for display */
export function formatDistance(km: number, imperial: boolean): string {
  if (imperial) {
    const miles = kmToMiles(km);
    return miles < 0.1 ? '0 mi' : `${miles.toFixed(1)} mi`;
  }
  return km < 0.1 ? '0 km' : `${km.toFixed(1)} km`;
}

/** Format altitude for display */
export function formatAltitude(meters: number, imperial: boolean): string {
  if (imperial) {
    return `${Math.round(metersToFeet(meters))} ft`;
  }
  return `${Math.round(meters)} m`;
}

/** Get the altitude display value (number only) in the user's preferred unit */
export function getAltitudeDisplayValue(meters: number, imperial: boolean): number {
  if (imperial) {
    return Math.round(metersToFeet(meters));
  }
  return Math.round(meters);
}

/** Get the step size in the display unit */
export function getStepInDisplayUnit(imperial: boolean): number {
  // Always step by 10 in whatever unit is displayed
  return ALTITUDE_STEP;
}

/** Convert a display unit value back to meters */
export function displayValueToMeters(value: number, imperial: boolean): number {
  if (imperial) {
    return feetToMeters(value);
  }
  return value;
}

/**
 * Calculate compass heading from magnetometer x, y values.
 * Returns degrees 0-360 where 0 = North.
 */
export function magnetometerToHeading(x: number, y: number): number {
  let heading = Math.atan2(y, x) * (180 / Math.PI);
  // Normalize to 0-360
  heading = (heading + 360) % 360;
  // Adjust so 0 = North (magnetometer has x pointing right, y pointing up)
  heading = (360 - heading) % 360;
  return heading;
}

/** Get cardinal direction from heading */
export function headingToCardinal(heading: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(heading / 45) % 8;
  return directions[index];
}
