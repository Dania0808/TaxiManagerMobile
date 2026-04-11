import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { LatLng } from '../types/passenger';

type NativeGeolocationCoordinates = {
  latitude: number;
  longitude: number;
  heading?: number | null;
  speed?: number | null;
  accuracy?: number | null;
};

type NativeGeolocationPosition = {
  coords: NativeGeolocationCoordinates;
};

type LiveLocationOptions = {
  enabled: boolean;
  onLocation: (position: NativeGeolocationPosition) => void | Promise<void>;
  distanceFilter?: number;
  intervalMs?: number;
};

export function useLiveLocation({
  enabled,
  onLocation,
  distanceFilter = 10,
  intervalMs = 7000,
}: LiveLocationOptions) {
  const [currentCoords, setCurrentCoords] = useState<LatLng | null>(null);
  const [locationError, setLocationError] = useState('');
  const lastSentAtRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      setLocationError('');
      return;
    }

    let isMounted = true;
    let subscription: Location.LocationSubscription | null = null;

    const startWatching = async () => {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (!isMounted) return;

      if (permission.status !== 'granted') {
        setLocationError('Location permission was not granted.');
        return;
      }

      try {
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: distanceFilter,
            timeInterval: intervalMs,
          },
          async (position) => {
            if (!isMounted) return;

            const now = Date.now();
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };

            setCurrentCoords(coords);
            setLocationError('');

            if (now - lastSentAtRef.current < intervalMs) {
              return;
            }

            lastSentAtRef.current = now;
            await onLocation({
              coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                heading: position.coords.heading ?? null,
                speed: position.coords.speed ?? null,
                accuracy: position.coords.accuracy ?? null,
              },
            });
          }
        );
      } catch (error: any) {
        if (!isMounted) return;
        setLocationError(error?.message || 'Failed to get live location.');
      }
    };

    startWatching();

    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, [distanceFilter, enabled, intervalMs, onLocation]);

  return {
    currentCoords,
    locationError,
  };
}
