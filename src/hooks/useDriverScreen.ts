import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Linking } from 'react-native';
import { useLiveLocation } from './useLiveLocation';
import {
  acceptRide,
  getAvailableRides,
  getDriverCurrentRide,
  getDriverRideTracking,
  updateDriverLiveLocation,
  updateDriverRideStatus,
} from '../services/driverService';
import {
  AvailableRideType,
  DriverCurrentRideType,
  DriverNavigationTarget,
  DriverStoredUser,
} from '../types/driver';
import { RideTrackingSnapshot } from '../types/liveTracking';

export function useDriverScreen() {
  const [user, setUser] = useState<DriverStoredUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const [availableRides, setAvailableRides] = useState<AvailableRideType[]>([]);
  const [currentRide, setCurrentRide] = useState<DriverCurrentRideType | null>(null);
  const [trackingSnapshot, setTrackingSnapshot] =
    useState<RideTrackingSnapshot | null>(null);
  const [trackingUnavailable, setTrackingUnavailable] = useState(false);
  const [message, setMessage] = useState('');

  const driverId = user?.driverId;

  const navigationTarget = useMemo<DriverNavigationTarget>(() => {
    if (!currentRide) {
      return {
        title: 'Waiting for ride',
        subtitle: 'Accept a ride to start navigation.',
        coords: null,
      };
    }

    const pickupCoords =
      currentRide.pickupLatitude != null && currentRide.pickupLongitude != null
        ? {
            latitude: currentRide.pickupLatitude,
            longitude: currentRide.pickupLongitude,
          }
        : null;

    const destinationCoords =
      currentRide.destinationLatitude != null &&
      currentRide.destinationLongitude != null
        ? {
            latitude: currentRide.destinationLatitude,
            longitude: currentRide.destinationLongitude,
          }
        : null;

    if (currentRide.status === 'PickedUp') {
      return {
        title: 'Navigate to destination',
        subtitle: currentRide.destination,
        coords: destinationCoords,
      };
    }

    return {
      title: 'Navigate to pickup',
      subtitle: currentRide.pickupLocation,
      coords: pickupCoords,
    };
  }, [currentRide]);

  const shouldShareDriverLocation =
    !!driverId &&
    !!currentRide?.id &&
    !trackingUnavailable &&
    currentRide.status !== 'Completed' &&
    currentRide.status !== 'Cancelled';

  const loadUser = async () => {
    try {
      setLoadingUser(true);

      const storedUser = await AsyncStorage.getItem('user');

      if (!storedUser) {
        setNotLoggedIn(true);
        return;
      }

      const parsedUser: DriverStoredUser = JSON.parse(storedUser);
      setUser(parsedUser);

      if (!parsedUser.driverId) {
        setMessage('Driver account data is missing. Please login again.');
      } else {
        setMessage('');
      }
    } catch (error) {
      console.log('LOAD DRIVER USER ERROR:', error);
      setNotLoggedIn(true);
    } finally {
      setLoadingUser(false);
    }
  };

  const handleGetAvailableRides = useCallback(async () => {
    try {
      const data = await getAvailableRides();
      setAvailableRides(data);
      setMessage('');
    } catch (error: any) {
      console.log('AVAILABLE RIDES ERROR:', error?.response?.data || error?.message);
      setMessage(error?.response?.data || 'Failed to load available rides.');
    }
  }, []);

  const handleGetCurrentRide = useCallback(async () => {
    if (!driverId) {
      setMessage('Driver ID not found. Please login again.');
      return;
    }

    try {
      const data = await getDriverCurrentRide(driverId);
      setCurrentRide(data);
      setMessage('');
      setTrackingUnavailable(false);
    } catch (error: any) {
      setCurrentRide(null);
      setTrackingSnapshot(null);
      setTrackingUnavailable(false);

      if (error?.response?.status === 404) {
        setMessage(error?.response?.data || 'You do not have a current ride yet.');
      } else {
        console.log(
          'CURRENT DRIVER RIDE ERROR:',
          error?.response?.data || error?.message
        );
        setMessage(error?.response?.data || 'Failed to load current ride.');
      }
    }
  }, [driverId]);

  const handleAcceptRide = async (rideId: number) => {
    if (!driverId) {
      const msg = 'Driver ID not found. Please login again.';
      setMessage(msg);
      Alert.alert('Error', msg);
      return;
    }

    try {
      const responseMessage = await acceptRide({ rideId, driverId });
      setMessage(responseMessage);

      await handleGetAvailableRides();
      await handleGetCurrentRide();
    } catch (error: any) {
      console.log('ACCEPT RIDE ERROR:', error?.response?.data || error?.message);
      const backendMessage = error?.response?.data || 'Failed to accept ride.';
      setMessage(backendMessage);
      Alert.alert('Accept Ride Failed', backendMessage);
    }
  };

  const handleUpdateRideStatus = async (newStatus: string) => {
    if (!currentRide) {
      const msg = 'No current ride to update.';
      setMessage(msg);
      Alert.alert('Error', msg);
      return;
    }

    try {
      const responseMessage = await updateDriverRideStatus({
        rideId: currentRide.id,
        status: newStatus,
      });

      setMessage(responseMessage);
      await handleGetCurrentRide();
    } catch (error: any) {
      console.log('UPDATE STATUS ERROR:', error?.response?.data || error?.message);
      const backendMessage = error?.response?.data || 'Failed to update ride status.';
      setMessage(backendMessage);
      Alert.alert('Update Failed', backendMessage);
    }
  };

  const handleRefreshTracking = useCallback(async () => {
    if (!currentRide?.id) return;

    try {
      const data = await getDriverRideTracking(currentRide.id);
      setTrackingSnapshot(data);
      setTrackingUnavailable(false);
    } catch (error: any) {
      if (error?.response?.status === 404 || error?.response?.status === 401) {
        setTrackingUnavailable(true);
        return;
      }

      console.log('DRIVER TRACKING ERROR:', error?.response?.data || error?.message);
    }
  }, [currentRide?.id]);

  const handleOpenExternalNavigation = async () => {
    if (!navigationTarget.coords) {
      Alert.alert('Navigation', 'Location coordinates are missing for this ride.');
      return;
    }

    const url = `https://www.google.com/maps/dir/?api=1&destination=${navigationTarget.coords.latitude},${navigationTarget.coords.longitude}&travelmode=driving`;
    const canOpen = await Linking.canOpenURL(url);

    if (!canOpen) {
      Alert.alert('Navigation', 'No navigation app is available.');
      return;
    }

    await Linking.openURL(url);
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (!driverId) return;

    handleGetAvailableRides();
    handleGetCurrentRide();
  }, [driverId, handleGetAvailableRides, handleGetCurrentRide]);

  useEffect(() => {
    if (!currentRide?.id || trackingUnavailable) return;

    handleRefreshTracking();

    const intervalId = setInterval(() => {
      handleRefreshTracking();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [currentRide?.id, trackingUnavailable, handleRefreshTracking]);

  const { currentCoords, locationError } = useLiveLocation({
    enabled: shouldShareDriverLocation,
    onLocation: async (position) => {
      if (!driverId || !currentRide?.id) return;

      try {
        await updateDriverLiveLocation({
          rideId: currentRide.id,
          driverId,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          heading: position.coords.heading ?? null,
          speed: position.coords.speed ?? null,
          accuracy: position.coords.accuracy ?? null,
        });
      } catch (error: any) {
        if (error?.response?.status === 404 || error?.response?.status === 401) {
          setTrackingUnavailable(true);
          return;
        }

        console.log(
          'DRIVER LOCATION UPDATE ERROR:',
          error?.response?.data || error?.message
        );
      }
    },
  });

  return {
    user,
    loadingUser,
    notLoggedIn,
    availableRides,
    currentRide,
    trackingSnapshot,
    trackingUnavailable,
    currentCoords,
    locationError,
    message,
    navigationTarget,
    handleAcceptRide,
    handleGetAvailableRides,
    handleGetCurrentRide,
    handleUpdateRideStatus,
    handleRefreshTracking,
    handleOpenExternalNavigation,
  };
}
