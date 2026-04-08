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
    if (!enabled) return;

    const geolocation = globalThis.navigator?.geolocation;

    if (!geolocation) {
      setLocationError('Geolocation is not available on this device.');
      return;
    }

    const watchId = geolocation.watchPosition(
      async (position) => {
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
        await onLocation(position as NativeGeolocationPosition);
      },
      (error) => {
        setLocationError(error.message || 'Failed to get live location.');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 3000,
      }
    );

    return () => {
      geolocation.clearWatch(watchId);
    };
  }, [distanceFilter, enabled, intervalMs, onLocation]);

  return {
    currentCoords,
    locationError,
  };
}
