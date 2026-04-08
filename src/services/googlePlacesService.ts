import { LatLng, PlaceSuggestion } from '../types/passenger';

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

function ensureGoogleKey() {
  if (!GOOGLE_API_KEY) {
    throw new Error(
      'Google Maps API key is missing. Add EXPO_PUBLIC_GOOGLE_MAPS_API_KEY to TaxiManagerMobile/.env and restart Expo.'
    );
  }
}

export async function searchGooglePlaces(query: string): Promise<PlaceSuggestion[]> {
  ensureGoogleKey();

  if (query.trim().length < 3) {
    return [];
  }

  const response = await fetch(
    'https://places.googleapis.com/v1/places:autocomplete',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask':
          'suggestions.placePrediction.placeId,suggestions.placePrediction.text.text,suggestions.placePrediction.structuredFormat',
      },
      body: JSON.stringify({
        input: query,
        includedRegionCodes: ['il'],
        languageCode: 'en',
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Places autocomplete failed: ${errorText}`);
  }

  const data = await response.json();

  const suggestions: PlaceSuggestion[] =
    data?.suggestions
      ?.filter((item: any) => item?.placePrediction?.placeId)
      ?.map((item: any) => ({
        placeId: item.placePrediction.placeId,
        primaryText: item.placePrediction.text?.text || '',
        secondaryText:
          item.placePrediction.structuredFormat?.secondaryText?.text || '',
      })) || [];

  return suggestions;
}

export async function getGooglePlaceDetails(placeId: string): Promise<{
  label: string;
  coords: LatLng | null;
}> {
  ensureGoogleKey();

  const response = await fetch(
    `https://places.googleapis.com/v1/places/${placeId}`,
    {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'id,displayName,formattedAddress,location',
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Place details failed: ${errorText}`);
  }

  const data = await response.json();

  const coords: LatLng | null = data?.location
    ? {
        latitude: data.location.latitude,
        longitude: data.location.longitude,
      }
    : null;

  const label =
    data?.formattedAddress ||
    data?.displayName?.text ||
    '';

  return { label, coords };
}