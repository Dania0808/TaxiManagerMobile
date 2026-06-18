import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
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

const EILAT_COORDS = {
  latitude: 29.5577,
  longitude: 34.9519,
};

const FAKE_DRIVER_ID = 17;

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
    let fakeLocationInterval: ReturnType<typeof setInterval> | null = null;

    const startWatching = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const isFakeDriver =
          parsedUser?.role === 'Driver' && parsedUser?.driverId === FAKE_DRIVER_ID;

        if (isFakeDriver) {
          setCurrentCoords(EILAT_COORDS);
          setLocationError('');

          const emitFakeLocation = async () => {
            if (!isMounted) return;

            const now = Date.now();
            setCurrentCoords(EILAT_COORDS);

            if (now - lastSentAtRef.current < intervalMs) {
              return;
            }

            lastSentAtRef.current = now;
            await onLocation({
              coords: {
                latitude: EILAT_COORDS.latitude,
                longitude: EILAT_COORDS.longitude,
                heading: null,
                speed: 0,
                accuracy: 1,
              },
            });
          };

          await emitFakeLocation();
          fakeLocationInterval = setInterval(() => {
            emitFakeLocation().catch((error: any) => {
              if (!isMounted) return;
              setLocationError(error?.message || 'Failed to set fake location.');
            });
          }, intervalMs);

          return;
        }
      } catch (error: any) {
        if (!isMounted) return;
        setLocationError(error?.message || 'Failed to load user for location.');
        return;
      }

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
      if (fakeLocationInterval) {
        clearInterval(fakeLocationInterval);
      }
      subscription?.remove();
    };
  }, [distanceFilter, enabled, intervalMs, onLocation]);

  return {
    currentCoords,
    locationError,
  };
}
