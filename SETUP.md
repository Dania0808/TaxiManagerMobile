# TaxiManagerMobile Setup

## Local development

1. Create a local `.env` file in `TaxiManagerMobile`.
2. Copy the values from `.env.example`.
3. Set `EXPO_PUBLIC_API_BASE_URL` to the backend URL that your phone/emulator can reach.
4. Set `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` to your Google Places API key.
5. Restart Expo after changing `.env`.

Example local `.env`:

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.20:5213/api
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

## How to verify

- Start the API locally.
- Start Expo.
- Open the app and try logging in.
- If login works without editing `src/services/api.ts`, the configuration is working correctly.

## Production switch later

When the backend is deployed to the Ruppin server, only change `EXPO_PUBLIC_API_BASE_URL` to the production API URL and rebuild/restart the app.
