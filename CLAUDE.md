# vista

Expo app that shows how far you can see from your position and altitude, as a circle on a map. iOS and Android.
Expo SDK 55, expo-router (typed routes), React Native 0.83, react-native-maps. npm, Node 22.15.0.

## Commands
- `npm install`, then `npx expo install --fix` after any Expo or React Native version change. Do not hand-edit those versions.
- `npm start` (Expo dev server), `npm run ios`, `npm run android`. No test suite or lint script.
- Builds: EAS (`eas.json` has `development`, `preview`, `production`). Project id is in `app.json`.

## Where things live
- Identity lane: personal. No Vercel, Convex, PostHog or database.
- Bundle id and Android package: `com.jamesdimonaco.vista`.
- Screens: `app/(tabs)/`. Math: `utils/calculations.ts`. Data hooks: `hooks/` (`useLandmarks` calls the public Overpass API).
- Env: `.env` holds `EXPO_PUBLIC_OPENWEATHER_API_KEY`. Keep it out of git.

## Gotchas
- The `origin` remote is https. Push with `git push git@github.com:JamesDimonaco/vista.git <branch>`.
- Location and motion permission text lives in `app.json`. Changing it needs a new native build.
