import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Linking } from 'react-native';
import { useLiveLocation } from './useLiveLocation';
import {
  acceptDriverOffer,
  cancelDriverRide,
  claimOpenRideRequest,
  closeDriverCompletedRidePayment,
  declineDriverOffer,
  getCurrentDriverOffer,
  getDriverCurrentRide,
  getDriverRideTracking,
  getOpenRideRequests,
  updateActorLiveLocation,
  updateDriverAvailability,
  updateDriverRideStatus,
} from '../services/driverService';
import {
  AvailableRideType,
  DriverCurrentRideType,
  DriverIncomingOfferType,
  DriverNavigationTarget,
  DriverScreenState,
  DriverStoredUser,
} from '../types/driver';
import { RideTrackingSnapshot } from '../types/liveTracking';

const DEFAULT_COORDS = {
  latitude: 32.0853,
  longitude: 34.7818,
};

const ACTIVE_RIDE_STATUSES = ['Accepted', 'OnTheWay', 'PickedUp'];

function parseDate(value?: string | null) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getRequestedDate(ride?: {
  requestedAt?: string | null;
  createdAt?: string | null;
} | null) {
  return parseDate(ride?.requestedAt) ?? parseDate(ride?.createdAt);
}

function getWaitMinutes(
  ride?: {
    requestedAt?: string | null;
    createdAt?: string | null;
  } | null,
  now = Date.now()
) {
  const requestedDate = getRequestedDate(ride);
  if (!requestedDate) return null;
  return Math.max(0, Math.floor((now - requestedDate.getTime()) / 60000));
}

function getOfferCountdown(
  ride?: { offerExpiresAt?: string | null } | null,
  now = Date.now()
) {
  const expiresAt = parseDate(ride?.offerExpiresAt);
  if (!expiresAt) return null;
  return Math.max(0, Math.floor((expiresAt.getTime() - now) / 1000));
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function distanceKm(
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number
) {
  const earthRadiusKm = 6371;
  const deltaLatitude = toRadians(latitude2 - latitude1);
  const deltaLongitude = toRadians(longitude2 - longitude1);
  const startLatitude = toRadians(latitude1);
  const endLatitude = toRadians(latitude2);

  const a =
    Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
    Math.sin(deltaLongitude / 2) *
      Math.sin(deltaLongitude / 2) *
      Math.cos(startLatitude) *
      Math.cos(endLatitude);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useDriverScreen() {
  const [user, setUser] = useState<DriverStoredUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const [openRideRequests, setOpenRideRequests] = useState<AvailableRideType[]>([]);
  const [incomingOffer, setIncomingOffer] = useState<DriverIncomingOfferType | null>(null);
  const [currentRide, setCurrentRide] = useState<DriverCurrentRideType | null>(null);
  const [trackingSnapshot, setTrackingSnapshot] =
    useState<RideTrackingSnapshot | null>(null);
  const [trackingUnavailable, setTrackingUnavailable] = useState(false);
  const [message, setMessage] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [timeTick, setTimeTick] = useState(Date.now());
  const [isTogglingOnline, setIsTogglingOnline] = useState(false);
  const [isRefreshingRequests, setIsRefreshingRequests] = useState(false);
  const [isRefreshingRide, setIsRefreshingRide] = useState(false);
  const [isRefreshingTracking, setIsRefreshingTracking] = useState(false);
  const [activeOfferActionId, setActiveOfferActionId] = useState<number | null>(null);
  const [activeClaimRideId, setActiveClaimRideId] = useState<number | null>(null);
  const [isUpdatingRideStatus, setIsUpdatingRideStatus] = useState(false);
  const [isCancellingRide, setIsCancellingRide] = useState(false);
  const [isClosingCompletedRide, setIsClosingCompletedRide] = useState(false);
  const driverId = user?.driverId;

  const pushDriverActorLocation = useCallback(
    async (latitude: number, longitude: number) => {
      if (!driverId) return;

      try {
        await updateActorLiveLocation({
          actorId: driverId,
          actorType: 'Driver',
          latitude,
          longitude,
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
    [driverId]
  );

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

  const shouldShareWaitingLocation = !!driverId && isOnline && !currentRide;
  const shouldShareActiveRideLocation =
    !!driverId &&
    !!currentRide?.id &&
    !trackingUnavailable &&
    ACTIVE_RIDE_STATUSES.includes(currentRide.status);

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

  const handleGetCurrentOffer = useCallback(async () => {
    if (!driverId || !isOnline || currentRide) {
      setIncomingOffer(null);
      return;
    }

    try {
      const data = await getCurrentDriverOffer(driverId);
      setIncomingOffer(data);
      if (data) {
        setMessage('');
      }
    } catch (error: any) {
      console.log('CURRENT OFFER ERROR:', error?.response?.data || error?.message);
      setMessage(error?.response?.data || 'Failed to load current offer.');
    }
  }, [currentRide, driverId, isOnline]);

  const handleGetOpenRideRequests = useCallback(async () => {
    if (!isOnline) {
      setOpenRideRequests([]);
      return;
    }

    try {
      setIsRefreshingRequests(true);
      const data = await getOpenRideRequests();
      setOpenRideRequests(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.log('OPEN REQUESTS ERROR:', error?.response?.data || error?.message);
      setMessage(error?.response?.data || 'Failed to load open requests.');
    } finally {
      setIsRefreshingRequests(false);
    }
  }, [isOnline]);

  const handleGetCurrentRide = useCallback(async () => {
    if (!driverId) {
      setMessage('Driver ID not found. Please login again.');
      return;
    }

    try {
      setIsRefreshingRide(true);
      const data = await getDriverCurrentRide(driverId);
      setCurrentRide(data);
      setMessage('');
      setTrackingUnavailable(false);
    } catch (error: any) {
      setCurrentRide(null);
      setTrackingSnapshot(null);
      setTrackingUnavailable(false);

        if (error?.response?.status === 404) {
          setMessage('');
        } else {
        console.log(
          'CURRENT DRIVER RIDE ERROR:',
          error?.response?.data || error?.message
        );
        setMessage(error?.response?.data || 'Failed to load current ride.');
      }
    } finally {
      setIsRefreshingRide(false);
    }
  }, [currentRide?.id, driverId]);

  const handleToggleOnlineStatus = useCallback(async () => {
    if (!driverId) {
      setMessage('Driver ID not found. Please login again.');
      return;
    }

    const nextOnlineState = !isOnline;

    try {
      setIsTogglingOnline(true);
      await updateDriverAvailability({
        driverId,
        isOnline: nextOnlineState,
      });

      setIsOnline(nextOnlineState);

      if (!nextOnlineState) {
        setIncomingOffer(null);
        setOpenRideRequests([]);
        setMessage('');
      } else {
        setMessage('');
      }
    } catch (error: any) {
      console.log('AVAILABILITY ERROR:', error?.response?.data || error?.message);
      setMessage(error?.response?.data || 'Failed to update driver availability.');
      Alert.alert(
        'Availability',
        error?.response?.data || 'Failed to update driver availability.'
      );
    } finally {
      setIsTogglingOnline(false);
    }
  }, [driverId, isOnline]);

  const handleAcceptRide = async (offerId: number) => {
    try {
      setActiveOfferActionId(offerId);
      await acceptDriverOffer(offerId);
      setMessage('');
      setIncomingOffer(null);
      await handleGetCurrentRide();
      await handleGetOpenRideRequests();
    } catch (error: any) {
      console.log('ACCEPT OFFER ERROR:', error?.response?.data || error?.message);
      const backendMessage = error?.response?.data || 'Failed to accept ride.';
      setMessage(backendMessage);
      Alert.alert('Accept Ride Failed', backendMessage);
    } finally {
      setActiveOfferActionId(null);
    }
  };

  const handleClaimOpenRideRequest = useCallback(async (rideId: number) => {
    if (!driverId) {
      setMessage('Driver ID not found. Please login again.');
      return;
    }

    try {
      setActiveClaimRideId(rideId);
      await claimOpenRideRequest(rideId, driverId);
      setMessage('');
      await handleGetCurrentRide();
      await handleGetCurrentOffer();
      await handleGetOpenRideRequests();
    } catch (error: any) {
      console.log('CLAIM RIDE ERROR:', error?.response?.data || error?.message);
      const backendMessage = error?.response?.data || 'Failed to claim ride.';
      setMessage(backendMessage);
      Alert.alert('Claim Ride Failed', backendMessage);
    } finally {
      setActiveClaimRideId(null);
    }
  }, [driverId, handleGetCurrentOffer, handleGetCurrentRide, handleGetOpenRideRequests]);

  const handleDeclineIncomingOffer = useCallback(async () => {
    if (!incomingOffer?.offerId) return;

    try {
      setActiveOfferActionId(incomingOffer.offerId);
      await declineDriverOffer(incomingOffer.offerId);
      setIncomingOffer(null);
      setMessage('');
      await handleGetCurrentOffer();
    } catch (error: any) {
      console.log('DECLINE OFFER ERROR:', error?.response?.data || error?.message);
      const backendMessage = error?.response?.data || 'Failed to decline ride.';
      setMessage(backendMessage);
      Alert.alert('Decline Ride Failed', backendMessage);
    } finally {
      setActiveOfferActionId(null);
    }
  }, [handleGetCurrentOffer, incomingOffer]);

  const handleUpdateRideStatus = async (newStatus: string) => {
    if (!currentRide) {
      const nextMessage = 'No current ride to update.';
      setMessage(nextMessage);
      Alert.alert('Error', nextMessage);
      return;
    }

    try {
      setIsUpdatingRideStatus(true);
      await updateDriverRideStatus({
        rideId: currentRide.id,
        status: newStatus,
      });

      setMessage('');
      await handleGetCurrentRide();
      await handleGetOpenRideRequests();
    } catch (error: any) {
      const rawBackendMessage = error?.response?.data;
      const backendMessage =
        (typeof rawBackendMessage === 'string' && rawBackendMessage.trim()) ||
        error?.message ||
        `Failed to update ride status to ${newStatus}.`;
      console.log('UPDATE STATUS ERROR:', {
        statusCode: error?.response?.status,
        responseData: rawBackendMessage,
        message: error?.message,
      });
      setMessage(backendMessage);
      Alert.alert('Update Failed', backendMessage);
    } finally {
      setIsUpdatingRideStatus(false);
    }
  };

  const handleCancelCurrentRide = useCallback(
    async (reason: string, note = '') => {
      if (!driverId) {
        setMessage('Driver ID not found. Please login again.');
        return false;
      }

      if (!currentRide?.id) {
        setMessage('No current ride to cancel.');
        return false;
      }

      try {
        setIsCancellingRide(true);
        await cancelDriverRide({
          rideId: currentRide.id,
          driverId,
          reason,
          note,
        });

        setMessage('');
        setCurrentRide(null);
        setTrackingSnapshot(null);
        await handleGetCurrentOffer();
        await handleGetOpenRideRequests();
        return true;
      } catch (error: any) {
        const backendMessage = error?.response?.data || 'Failed to cancel ride.';
        setMessage(backendMessage);
        Alert.alert('Cancel Ride Failed', backendMessage);
        return false;
      } finally {
        setIsCancellingRide(false);
      }
    },
    [currentRide?.id, driverId, handleGetCurrentOffer, handleGetOpenRideRequests]
  );

  const handleRefreshTracking = useCallback(async () => {
    if (!currentRide?.id) return;

    try {
      setIsRefreshingTracking(true);
      const data = await getDriverRideTracking(currentRide.id);
      setTrackingSnapshot(data);
      setTrackingUnavailable(false);
    } catch (error: any) {
      if (error?.response?.status === 404 || error?.response?.status === 401) {
        setTrackingUnavailable(true);
        return;
      }

      console.log('DRIVER TRACKING ERROR:', error?.response?.data || error?.message);
    } finally {
      setIsRefreshingTracking(false);
    }
  }, [currentRide?.id]);

  const handleCloseCompletedRide = useCallback(async () => {
    if (!driverId) {
      setMessage('Driver ID not found. Please login again.');
      return false;
    }

    if (!currentRide?.id) {
      setMessage('No completed ride was found.');
      return false;
    }

    try {
      setIsClosingCompletedRide(true);
      await closeDriverCompletedRidePayment({
        rideId: currentRide.id,
        driverId,
      });
      setCurrentRide(null);
      setTrackingSnapshot(null);
      setMessage('');
      await handleGetCurrentOffer();
      await handleGetOpenRideRequests();
      return true;
    } catch (error: any) {
      const backendMessage = error?.response?.data || 'Failed to close completed ride.';
      setMessage(backendMessage);
      Alert.alert('Close Trip Failed', backendMessage);
      return false;
    } finally {
      setIsClosingCompletedRide(false);
    }
  }, [currentRide?.id, driverId, handleGetCurrentOffer, handleGetOpenRideRequests]);

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
    handleGetCurrentRide();
  }, [driverId, handleGetCurrentRide]);

  useEffect(() => {
    if (!driverId || !isOnline || currentRide) return;

    handleGetCurrentOffer();
    handleGetOpenRideRequests();

    const intervalId = setInterval(() => {
      handleGetCurrentOffer();
    }, 3000);

    const openRequestsIntervalId = setInterval(() => {
      handleGetOpenRideRequests();
    }, 10000);

    return () => {
      clearInterval(intervalId);
      clearInterval(openRequestsIntervalId);
    };
  }, [
    currentRide,
    driverId,
    handleGetCurrentOffer,
    handleGetOpenRideRequests,
    isOnline,
  ]);

  useEffect(() => {
    if (!currentRide?.id || trackingUnavailable) return;

    handleRefreshTracking();

    const intervalId = setInterval(() => {
      handleRefreshTracking();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [currentRide?.id, trackingUnavailable, handleRefreshTracking]);

  useEffect(() => {
    if (!driverId || !currentRide?.id) return;

    const intervalId = setInterval(() => {
      handleGetCurrentRide();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [currentRide?.id, currentRide?.status, driverId, handleGetCurrentRide]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeTick(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const { currentCoords, locationError } = useLiveLocation({
    enabled: shouldShareWaitingLocation || shouldShareActiveRideLocation,
    onLocation: async (position) => {
      if (!driverId) return;

      try {
        await pushDriverActorLocation(
          position.coords.latitude,
          position.coords.longitude
        );
      } catch {}
    },
  });

  const sortedOpenRideRequests = useMemo(() => {
    return [...openRideRequests].sort((firstRide, secondRide) => {
      const firstHasCoords =
        firstRide.pickupLatitude != null && firstRide.pickupLongitude != null;
      const secondHasCoords =
        secondRide.pickupLatitude != null && secondRide.pickupLongitude != null;

      if (currentCoords && firstHasCoords && secondHasCoords) {
        return (
          distanceKm(
            currentCoords.latitude,
            currentCoords.longitude,
            firstRide.pickupLatitude as number,
            firstRide.pickupLongitude as number
          ) -
          distanceKm(
            currentCoords.latitude,
            currentCoords.longitude,
            secondRide.pickupLatitude as number,
            secondRide.pickupLongitude as number
          )
        );
      }

      const firstRequested = getRequestedDate(firstRide)?.getTime() ?? Number.MAX_SAFE_INTEGER;
      const secondRequested =
        getRequestedDate(secondRide)?.getTime() ?? Number.MAX_SAFE_INTEGER;

      return firstRequested - secondRequested;
    });
  }, [currentCoords, openRideRequests]);

  const driverScreenState = useMemo<DriverScreenState>(() => {
    if (!isOnline) return 'offline';
    if (currentRide?.status === 'Completed') return 'ride_complete';
    if (currentRide?.status === 'PickedUp') return 'passenger_on_board';
    if (currentRide) return 'en_route_pickup';
    if (incomingOffer) return 'incoming_request';
    return 'online_waiting';
  }, [currentRide, incomingOffer, isOnline]);

  const activeRideWaitMinutes = useMemo(
    () => getWaitMinutes(currentRide, timeTick) ?? getWaitMinutes(incomingOffer, timeTick),
    [currentRide, incomingOffer, timeTick]
  );

  const incomingOfferWaitMinutes = useMemo(
    () => getWaitMinutes(incomingOffer, timeTick),
    [incomingOffer, timeTick]
  );

  const incomingOfferCountdownSeconds = useMemo(
    () => getOfferCountdown(incomingOffer, timeTick),
    [incomingOffer, timeTick]
  );

  const estimatedTripDurationMinutes =
    currentRide?.estimatedTripDurationMinutes ??
    incomingOffer?.estimatedTripDurationMinutes ??
    null;
  const driverPhase = useMemo(() => {
    if (!isOnline) return 'offline';
    if (currentRide?.status === 'Completed') return 'completed';
    if (currentRide?.status === 'PickedUp') return 'trip_in_progress';
    if (currentRide) return 'heading_to_pickup';
    if (incomingOffer) return 'incoming_offer';
    return 'waiting';
  }, [currentRide, incomingOffer, isOnline]);

  return {
    user,
    loadingUser,
    notLoggedIn,
    isOnline,
    driverScreenState,
    openRideRequests: sortedOpenRideRequests,
    incomingOffer,
    currentRide,
    trackingSnapshot,
    trackingUnavailable,
    currentCoords,
    locationError,
    message,
    driverPhase,
    navigationTarget,
    activeRideWaitMinutes,
    incomingOfferWaitMinutes,
    incomingOfferCountdownSeconds,
    estimatedTripDurationMinutes,
    defaultCoords: DEFAULT_COORDS,
    isTogglingOnline,
    isRefreshingRequests,
    isRefreshingRide,
    isRefreshingTracking,
    activeOfferActionId,
    activeClaimRideId,
    isUpdatingRideStatus,
    isCancellingRide,
    isClosingCompletedRide,
    handleAcceptRide,
    handleClaimOpenRideRequest,
    handleDeclineIncomingOffer,
    handleToggleOnlineStatus,
    handleGetOpenRideRequests,
    handleGetCurrentRide,
    handleUpdateRideStatus,
    handleRefreshTracking,
    handleOpenExternalNavigation,
    handleCancelCurrentRide,
    handleCloseCompletedRide,
  };
}
