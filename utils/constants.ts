// Earth
export const EARTH_RADIUS_KM = 6371;
export const EARTH_RADIUS_M = EARTH_RADIUS_KM * 1000;

// Atmospheric refraction correction factor (standard)
// Makes the effective Earth radius ~17% larger for horizon calculations
export const REFRACTION_FACTOR = 1.17;

// Effective radius accounting for refraction
export const EFFECTIVE_RADIUS_KM = EARTH_RADIUS_KM * REFRACTION_FACTOR;

// Altitude
export const ALTITUDE_STEP = 10;
export const ALTITUDE_MIN = 0;
export const ALTITUDE_MAX = 10000; // meters

// Stepper
export const LONG_PRESS_INTERVAL_MS = 150;

// Compass
export const COMPASS_SMOOTHING_ALPHA = 0.15;

// Map
export const DEFAULT_LATITUDE = 51.5074; // London fallback
export const DEFAULT_LONGITUDE = -0.1278;
export const MAP_CIRCLE_STROKE_WIDTH = 2;

// Units
export const METERS_PER_FOOT = 0.3048;
export const KM_PER_MILE = 1.60934;

// Weather API
// Free tier: https://openweathermap.org/api — sign up and paste your key here
export const OPENWEATHER_API_KEY: string | null = null;
