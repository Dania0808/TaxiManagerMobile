import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useLiveLocation } from './useLiveLocation';
import {
  getGooglePlaceDetails,
  searchGooglePlaces,
} from '../services/googlePlacesService';
import {
  cancelPassengerRide,
  createPassengerRide,
  getPassengerCoinBalance,
  getPassengerCurrentRide,
  getPassengerPendingFeedbackRide,
  getRideFareEstimate,
  getPassengerRideTracking,
  submitPassengerRideFeedback,
  updatePassengerLiveLocation,
} from '../services/passengerService';
import {
  CurrentRideType,
  INITIAL_REGION,
  LatLng,
  OrderPlacedRideType,
  PendingFeedbackRideType,
  PlaceSuggestion,
  RideFareEstimateType,
  RideType,
  StoredUser,
  isCancelledRideStatus,
} from '../types/passenger';
import { RideTrackingSnapshot } from '../types/liveTracking';

export function usePassengerScreen() {
  const previousRideStatusRef = useRef<string | null>(null);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [notLoggedIn, setNotLoggedIn] = useState(false);

  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [pickupCoords, setPickupCoords] = useState<LatLng | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<LatLng | null>(null);
  const [pickupSuggestions, setPickupSuggestions] = useState<PlaceSuggestion[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<PlaceSuggestion[]>([]);
  const [pickupLoading, setPickupLoading] = useState(false);
  const [destinationLoading, setDestinationLoading] = useState(false);
  const [pickupSelected, setPickupSelected] = useState(false);
  const [destinationSelected, setDestinationSelected] = useState(false);
  const [rideType, setRideType] = useState<RideType>('Immediate');
  const [scheduledTime, setScheduledTime] = useState('');
  const [passengerCount, setPassengerCount] = useState('1');
  const [luggageCount, setLuggageCount] = useState('0');
  const [message, setMessage] = useState('');
  const [coinBalance, setCoinBalance] = useState(0);
  const [currentRide, setCurrentRide] = useState<CurrentRideType | null>(null);
  const [orderPlacedRide, setOrderPlacedRide] =
    useState<OrderPlacedRideType | null>(null);
  const [trackingSnapshot, setTrackingSnapshot] =
    useState<RideTrackingSnapshot | null>(null);
  const [pendingFeedbackRide, setPendingFeedbackRide] =
    useState<PendingFeedbackRideType | null>(null);
  const [rating, setRating] = useState('5');
  const [wasDriverPolite, setWasDriverPolite] = useState(false);
  const [wasDriverOnTime, setWasDriverOnTime] = useState(false);
  const [wasVehicleClean, setWasVehicleClean] = useState(false);
  const [luggageHandlingRating, setLuggageHandlingRating] = useState('');
  const [comment, setComment] = useState('');
  const [reviewRequested, setReviewRequested] = useState(false);
  const [isSearchingDriver, setIsSearchingDriver] = useState(false);
  const [trackingUnavailable, setTrackingUnavailable] = useState(false);
  const [isCreatingRide, setIsCreatingRide] = useState(false);
  const [isRefreshingRide, setIsRefreshingRide] = useState(false);
  const [isRefreshingTracking, setIsRefreshingTracking] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [isCancellingRide, setIsCancellingRide] = useState(false);
  const [rideFareEstimate, setRideFareEstimate] = useState<RideFareEstimateType | null>(null);
  const [isLoadingRideFareEstimate, setIsLoadingRideFareEstimate] = useState(false);

  const passengerId = user?.passengerId ?? null;
  const hasBlockingRide =
    !!currentRide &&
    currentRide.status !== 'Completed' &&
    !isCancelledRideStatus(currentRide.status);

  const shouldShowBottomSheet =
    !!pickupCoords &&
    !!destinationCoords &&
    pickupSelected &&
    destinationSelected &&
    reviewRequested &&
    !hasBlockingRide &&
    !isSearchingDriver;

  const shouldTrackPassengerLocation =
    !!passengerId &&
    !!currentRide?.id &&
    !trackingUnavailable &&
    !!currentRide.driverId &&
    currentRide.status !== 'Pending' &&
    currentRide.status !== 'Completed' &&
    !isCancelledRideStatus(currentRide.status);

  const mapRegion = useMemo(() => {
    const trackingPickupCoords = trackingSnapshot?.pickupCoords ?? null;
    const trackingDestinationCoords = trackingSnapshot?.destinationCoords ?? null;
    const trackingDriverCoords = trackingSnapshot?.driverLocation
      ? {
          latitude: trackingSnapshot.driverLocation.latitude,
          longitude: trackingSnapshot.driverLocation.longitude,
        }
      : null;
    const trackingPassengerCoords = trackingSnapshot?.passengerLocation
      ? {
          latitude: trackingSnapshot.passengerLocation.latitude,
          longitude: trackingSnapshot.passengerLocation.longitude,
        }
      : null;
    const currentRidePickupCoords =
      currentRide?.pickupLatitude != null && currentRide?.pickupLongitude != null
        ? {
            latitude: currentRide.pickupLatitude,
            longitude: currentRide.pickupLongitude,
          }
        : null;
    const currentRideDestinationCoords =
      currentRide?.destinationLatitude != null && currentRide?.destinationLongitude != null
        ? {
            latitude: currentRide.destinationLatitude,
            longitude: currentRide.destinationLongitude,
          }
        : null;
    const activePickupCoords = trackingPickupCoords ?? currentRidePickupCoords;
    const activeDestinationCoords =
      trackingDestinationCoords ?? currentRideDestinationCoords;

    if (trackingDriverCoords && trackingPassengerCoords) {
      return {
        latitude:
          (trackingDriverCoords.latitude + trackingPassengerCoords.latitude) / 2,
        longitude:
          (trackingDriverCoords.longitude + trackingPassengerCoords.longitude) / 2,
        latitudeDelta: Math.max(
          Math.abs(trackingDriverCoords.latitude - trackingPassengerCoords.latitude) * 1.8,
          0.02
        ),
        longitudeDelta: Math.max(
          Math.abs(trackingDriverCoords.longitude - trackingPassengerCoords.longitude) * 1.8,
          0.02
        ),
      };
    }

    if (trackingDriverCoords && activePickupCoords) {
      return {
        latitude: (trackingDriverCoords.latitude + activePickupCoords.latitude) / 2,
        longitude: (trackingDriverCoords.longitude + activePickupCoords.longitude) / 2,
        latitudeDelta: Math.max(
          Math.abs(trackingDriverCoords.latitude - activePickupCoords.latitude) * 1.8,
          0.02
        ),
        longitudeDelta: Math.max(
          Math.abs(trackingDriverCoords.longitude - activePickupCoords.longitude) * 1.8,
          0.02
        ),
      };
    }

    if (trackingDriverCoords && activeDestinationCoords) {
      return {
        latitude:
          (trackingDriverCoords.latitude + activeDestinationCoords.latitude) / 2,
        longitude:
          (trackingDriverCoords.longitude + activeDestinationCoords.longitude) / 2,
        latitudeDelta: Math.max(
          Math.abs(trackingDriverCoords.latitude - activeDestinationCoords.latitude) * 1.8,
          0.02
        ),
        longitudeDelta: Math.max(
          Math.abs(trackingDriverCoords.longitude - activeDestinationCoords.longitude) * 1.8,
          0.02
        ),
      };
    }

    if (activePickupCoords && activeDestinationCoords) {
      return {
        latitude: (activePickupCoords.latitude + activeDestinationCoords.latitude) / 2,
        longitude: (activePickupCoords.longitude + activeDestinationCoords.longitude) / 2,
        latitudeDelta: Math.max(
          Math.abs(activePickupCoords.latitude - activeDestinationCoords.latitude) * 1.8,
          0.02
        ),
        longitudeDelta: Math.max(
          Math.abs(activePickupCoords.longitude - activeDestinationCoords.longitude) * 1.8,
          0.02
        ),
      };
    }

    if (pickupCoords && destinationCoords) {
      return {
        latitude: (pickupCoords.latitude + destinationCoords.latitude) / 2,
        longitude: (pickupCoords.longitude + destinationCoords.longitude) / 2,
        latitudeDelta: Math.max(
          Math.abs(pickupCoords.latitude - destinationCoords.latitude) * 1.8,
          0.02
        ),
        longitudeDelta: Math.max(
          Math.abs(pickupCoords.longitude - destinationCoords.longitude) * 1.8,
          0.02
        ),
      };
    }

    if (pickupCoords) {
      return {
        latitude: pickupCoords.latitude,
        longitude: pickupCoords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
    }

    if (destinationCoords) {
      return {
        latitude: destinationCoords.latitude,
        longitude: destinationCoords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
    }

    return INITIAL_REGION;
  }, [pickupCoords, destinationCoords, trackingSnapshot, currentRide]);

  const rideSummary = useMemo(
    () => ({
      from: pickupLocation.trim() || 'Not set',
      to: destination.trim() || 'Not set',
      rideType,
      passengers: passengerCount || '1',
      luggage: luggageCount || '0',
      scheduledTime: rideType === 'Scheduled' ? scheduledTime || 'Not set' : '-',
    }),
    [
      pickupLocation,
      destination,
      rideType,
      passengerCount,
      luggageCount,
      scheduledTime,
    ]
  );

  const passengerRidePhase = useMemo(() => {
    if (isCreatingRide || isSearchingDriver) return 'searching';

    if (!currentRide) return 'planning';

    if (isCancelledRideStatus(currentRide.status)) return 'planning';
    if (currentRide.status === 'Completed') return 'completed';
    if (currentRide.status === 'PickedUp') return 'in_progress';
    if (currentRide.status === 'OnTheWay') return 'driver_arriving';
    if (currentRide.status === 'Accepted') return 'driver_assigned';
    if (currentRide.status === 'Pending') return 'waiting_match';

    return 'active';
  }, [currentRide, isCreatingRide, isSearchingDriver]);

  const loadUser = async () => {
    try {
      setLoadingUser(true);
      const storedUser = await AsyncStorage.getItem('user');

      if (!storedUser) {
        setNotLoggedIn(true);
        return;
      }

      const parsedUser: StoredUser = JSON.parse(storedUser);
      setUser(parsedUser);

      if (!parsedUser.passengerId) {
        setMessage('Passenger account data is missing. Please login again.');
      }
    } catch (error) {
      console.log('LOAD USER ERROR:', error);
      setNotLoggedIn(true);
    } finally {
      setLoadingUser(false);
    }
  };

  const handleGetCoinBalance = useCallback(async () => {
    if (!passengerId) return;

    try {
      const data = await getPassengerCoinBalance(passengerId);
      setCoinBalance(data.coinBalance);
    } catch (error: any) {
      setMessage(error?.response?.data || 'Failed to load coin balance.');
    }
  }, [passengerId]);

  const handleGetCurrentRide = useCallback(async () => {
    if (!passengerId) return;

    try {
      setIsRefreshingRide(true);
      const data = await getPassengerCurrentRide(passengerId);
      setCurrentRide(data);
      setTrackingUnavailable(false);

      if (data) {
        setMessage('');
        setIsSearchingDriver(false);
      } else {
        setOrderPlacedRide(null);
        setTrackingSnapshot(null);
        setMessage('');
      }
    } catch (error: any) {
      setCurrentRide(null);
      setOrderPlacedRide(null);
      setTrackingSnapshot(null);
      setTrackingUnavailable(false);
      setMessage(error?.response?.data || 'Failed to load ride.');
    } finally {
      setIsRefreshingRide(false);
    }
  }, [passengerId]);

  const handleGetPendingFeedbackRide = useCallback(async () => {
    if (!passengerId) return;

    try {
      const data = await getPassengerPendingFeedbackRide(passengerId);
      setPendingFeedbackRide(data);
    } catch {
      setPendingFeedbackRide(null);
    }
  }, [passengerId]);

  const searchPlaces = async (query: string, type: 'pickup' | 'destination') => {
    if (query.trim().length < 3) {
      if (type === 'pickup') {
        setPickupSuggestions([]);
      } else {
        setDestinationSuggestions([]);
      }
      return;
    }

    try {
      if (type === 'pickup') {
        setPickupLoading(true);
      } else {
        setDestinationLoading(true);
      }

      const suggestions = await searchGooglePlaces(query);

      if (type === 'pickup') {
        setPickupSuggestions(suggestions);
      } else {
        setDestinationSuggestions(suggestions);
      }
    } catch (error: any) {
      console.log('PLACES SEARCH ERROR:', error);
      setMessage(error?.message || 'Failed to search locations.');
    } finally {
      if (type === 'pickup') {
        setPickupLoading(false);
      } else {
        setDestinationLoading(false);
      }
    }
  };

  const handleSelectPlace = async (
    suggestion: PlaceSuggestion,
    type: 'pickup' | 'destination'
  ) => {
    try {
      const data = await getGooglePlaceDetails(suggestion.placeId);

      if (type === 'pickup') {
        setPickupLocation(data.label);
        setPickupCoords(data.coords);
        setPickupSuggestions([]);
        setPickupSelected(true);
      } else {
        setDestination(data.label);
        setDestinationCoords(data.coords);
        setDestinationSuggestions([]);
        setDestinationSelected(true);
      }

      setMessage('');
    } catch (error: any) {
      console.log('PLACE DETAILS ERROR:', error);
      setMessage(error?.message || 'Failed to load place details.');
    }
  };

  const handlePickupTextChange = (text: string) => {
    setPickupLocation(text);
    setPickupSelected(false);
    setPickupCoords(null);
    setRideFareEstimate(null);
    setReviewRequested(false);
    setIsSearchingDriver(false);
    setOrderPlacedRide(null);
    searchPlaces(text, 'pickup');
  };

  const handleDestinationTextChange = (text: string) => {
    setDestination(text);
    setDestinationSelected(false);
    setDestinationCoords(null);
    setRideFareEstimate(null);
    setReviewRequested(false);
    setIsSearchingDriver(false);
    setOrderPlacedRide(null);
    searchPlaces(text, 'destination');
  };

  const handleReviewRide = () => {
    if (!pickupSelected || !destinationSelected || !pickupCoords || !destinationCoords) {
      Alert.alert(
        'Validation',
        'Please select real pickup and destination locations from the suggestions first.'
      );
      return;
    }

    const parsedPassengerCount = Number(passengerCount);
    const parsedLuggageCount = Number(luggageCount);

    if (Number.isNaN(parsedPassengerCount) || parsedPassengerCount < 1) {
      Alert.alert('Validation', 'Passenger count must be at least 1.');
      return;
    }

    if (Number.isNaN(parsedLuggageCount) || parsedLuggageCount < 0) {
      Alert.alert('Validation', 'Luggage count cannot be negative.');
      return;
    }

    if (rideType === 'Scheduled' && !scheduledTime.trim()) {
      Alert.alert('Validation', 'Please choose the scheduled time.');
      return;
    }

    setReviewRequested(true);
  };

  const handleCloseReviewRide = () => {
    setReviewRequested(false);
  };

  const resetRideForm = () => {
    setPickupLocation('');
    setDestination('');
    setPickupCoords(null);
    setDestinationCoords(null);
    setPickupSuggestions([]);
    setDestinationSuggestions([]);
    setPickupSelected(false);
    setDestinationSelected(false);
    setReviewRequested(false);
    setRideType('Immediate');
    setScheduledTime('');
    setPassengerCount('1');
    setLuggageCount('0');
    setRideFareEstimate(null);
    setIsLoadingRideFareEstimate(false);
  };

  const handleDismissOrderPlaced = () => {
    setOrderPlacedRide(null);
  };

  const clearCompletedRideFlowState = useCallback(() => {
    setMessage('');
    setPendingFeedbackRide(null);
    setCurrentRide(null);
    setOrderPlacedRide(null);
    setTrackingSnapshot(null);
    setTrackingUnavailable(false);
    resetRideForm();
  }, []);

  const handleGetRideFareEstimate = useCallback(async () => {
    if (
      !passengerId ||
      !pickupCoords ||
      !destinationCoords ||
      !pickupSelected ||
      !destinationSelected
    ) {
      setRideFareEstimate(null);
      setIsLoadingRideFareEstimate(false);
      return;
    }

    const parsedPassengerCount = Number(passengerCount || '1');
    const parsedLuggageCount = Number(luggageCount || '0');

    if (
      Number.isNaN(parsedPassengerCount) ||
      parsedPassengerCount < 1 ||
      Number.isNaN(parsedLuggageCount) ||
      parsedLuggageCount < 0
    ) {
      setRideFareEstimate(null);
      setIsLoadingRideFareEstimate(false);
      return;
    }

    try {
      setIsLoadingRideFareEstimate(true);
      const estimate = await getRideFareEstimate({
        passengerId,
        pickupLatitude: pickupCoords.latitude,
        pickupLongitude: pickupCoords.longitude,
        destinationLatitude: destinationCoords.latitude,
        destinationLongitude: destinationCoords.longitude,
        rideType,
        isShared: false,
        passengerCount: parsedPassengerCount,
        luggageCount: parsedLuggageCount,
      });
      setRideFareEstimate(estimate);
    } catch (error) {
      console.log('RIDE FARE ESTIMATE ERROR:', error);
      setRideFareEstimate(null);
    } finally {
      setIsLoadingRideFareEstimate(false);
    }
  }, [
    passengerId,
    pickupCoords,
    destinationCoords,
    pickupSelected,
    destinationSelected,
    passengerCount,
    luggageCount,
    rideType,
  ]);

  const handleCreateRide = async () => {
    if (!passengerId) {
      Alert.alert('Error', 'Please login again.');
      return;
    }

    if (!pickupSelected || !destinationSelected || !pickupCoords || !destinationCoords) {
      Alert.alert(
        'Validation',
        'Please select real pickup and destination locations from the suggestions.'
      );
      return;
    }

    const parsedPassengerCount = Number(passengerCount);
    const parsedLuggageCount = Number(luggageCount);

    if (Number.isNaN(parsedPassengerCount) || parsedPassengerCount < 1) {
      Alert.alert('Validation', 'Passenger count must be at least 1.');
      return;
    }

    if (Number.isNaN(parsedLuggageCount) || parsedLuggageCount < 0) {
      Alert.alert('Validation', 'Luggage count cannot be negative.');
      return;
    }

    if (rideType === 'Scheduled' && !scheduledTime.trim()) {
      Alert.alert('Validation', 'Please choose the scheduled time.');
      return;
    }

    try {
      const rideSummarySnapshot = rideSummary;
      setIsCreatingRide(true);
      setIsSearchingDriver(true);
      setMessage('Looking for a driver for you...');

      await createPassengerRide({
        passengerId,
        pickupLocation,
        pickupLatitude: pickupCoords.latitude,
        pickupLongitude: pickupCoords.longitude,
        destination,
        destinationLatitude: destinationCoords.latitude,
        destinationLongitude: destinationCoords.longitude,
        rideType,
        isShared: false,
        scheduledTime: rideType === 'Scheduled' ? scheduledTime : null,
        passengerCount: parsedPassengerCount,
        luggageCount: parsedLuggageCount,
      });

      const currentRideData = await getPassengerCurrentRide(passengerId);
      setOrderPlacedRide({
        rideSummary: rideSummarySnapshot,
        rideId: currentRideData?.id,
        status: currentRideData?.status || 'Pending',
      });
      setCurrentRide(currentRideData);
      setTrackingUnavailable(false);
      setMessage('');
      setIsSearchingDriver(false);
      resetRideForm();
    } catch (error: any) {
      setIsSearchingDriver(false);
      const msg = error?.response?.data || 'Failed to create ride';
      setMessage(msg);
      Alert.alert('Error', msg);
    } finally {
      setIsCreatingRide(false);
    }
  };

  const handleRefreshTrackingSnapshot = useCallback(async () => {
    if (!currentRide?.id) return;

    try {
      setIsRefreshingTracking(true);
      const data = await getPassengerRideTracking(currentRide.id);
      setTrackingSnapshot(data);
      setTrackingUnavailable(false);
    } catch (error: any) {
      if (error?.response?.status === 404 || error?.response?.status === 401) {
        setTrackingUnavailable(true);
        return;
      }

      console.log('PASSENGER TRACKING ERROR:', error?.response?.data || error?.message);
    } finally {
      setIsRefreshingTracking(false);
    }
  }, [currentRide?.id]);

  const handleSubmitFeedback = async () => {
    if (!passengerId || !pendingFeedbackRide) {
      Alert.alert('Error', 'No completed ride is waiting for feedback.');
      return false;
    }

    try {
      setIsSubmittingFeedback(true);
      const data = await submitPassengerRideFeedback({
        rideId: pendingFeedbackRide.id,
        passengerId,
        driverId: pendingFeedbackRide.driverId,
        rating: Number(rating),
        wasDriverPolite,
        wasDriverOnTime,
        wasVehicleClean,
        luggageHandlingRating: luggageHandlingRating
          ? Number(luggageHandlingRating)
          : null,
        comment,
      });

      setMessage('');
      setRating('5');
      setWasDriverPolite(false);
      setWasDriverOnTime(false);
      setWasVehicleClean(false);
      setLuggageHandlingRating('');
      setComment('');
      clearCompletedRideFlowState();

      await handleGetCoinBalance();
      await handleGetPendingFeedbackRide();
      return true;
    } catch (error: any) {
      const msg = error?.response?.data || 'Failed to submit feedback';
      setMessage(msg);
      Alert.alert('Feedback Failed', msg);
      return false;
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleCancelRide = async (reason: string, note = '') => {
    if (!passengerId) {
      Alert.alert('Error', 'Please login again.');
      return false;
    }

    const rideId = currentRide?.id ?? orderPlacedRide?.rideId;
    if (!rideId) {
      Alert.alert('Error', 'No cancellable ride was found.');
      return false;
    }

    try {
      setIsCancellingRide(true);
      const data = await cancelPassengerRide({
        rideId,
        passengerId,
        reason,
        note,
      });

      setMessage('');
      setCurrentRide(null);
      setOrderPlacedRide(null);
      setTrackingSnapshot(null);
      setTrackingUnavailable(false);
      return true;
    } catch (error: any) {
      const msg = error?.response?.data || 'Failed to cancel ride.';
      setMessage(msg);
      Alert.alert('Cancellation Failed', msg);
      return false;
    } finally {
      setIsCancellingRide(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (!passengerId) return;

    handleGetCoinBalance();
    handleGetCurrentRide();
    handleGetPendingFeedbackRide();
  }, [passengerId]);

  useEffect(() => {
    if (!reviewRequested || hasBlockingRide || isSearchingDriver) return;

    handleGetRideFareEstimate();
  }, [
    reviewRequested,
    hasBlockingRide,
    isSearchingDriver,
    handleGetRideFareEstimate,
  ]);

  useEffect(() => {
    if (!currentRide?.id || trackingUnavailable) return;

    handleRefreshTrackingSnapshot();

    const intervalId = setInterval(() => {
      handleRefreshTrackingSnapshot();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [currentRide?.id, trackingUnavailable]);

  useEffect(() => {
    if (!passengerId || !currentRide?.id) return;
    if (
      currentRide.status === 'Completed' ||
      isCancelledRideStatus(currentRide.status)
    ) {
      return;
    }

    const intervalId = setInterval(() => {
      handleGetCurrentRide();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [currentRide?.id, currentRide?.status, passengerId]);

  useEffect(() => {
    if (!passengerId || currentRide?.status !== 'Completed') return;

    handleGetPendingFeedbackRide();
  }, [currentRide?.status, passengerId]);

  useEffect(() => {
    if (!currentRide || currentRide.status === 'Pending') return;

    setOrderPlacedRide((existingRide) => {
      if (!existingRide) return null;
      return existingRide.rideId === currentRide.id ? null : existingRide;
    });
  }, [currentRide]);

  useEffect(() => {
    const previousStatus = previousRideStatusRef.current;
    const nextStatus = currentRide?.status ?? null;

    if (
      previousStatus &&
      (previousStatus === 'Accepted' || previousStatus === 'OnTheWay') &&
      nextStatus === 'Pending'
    ) {
      setMessage('');
      setIsSearchingDriver(true);
    }

    if (nextStatus === 'Accepted' || nextStatus === 'OnTheWay' || nextStatus === 'PickedUp') {
      setIsSearchingDriver(false);
    }

    previousRideStatusRef.current = nextStatus;
  }, [currentRide?.status]);

  useLiveLocation({
    enabled: shouldTrackPassengerLocation,
    onLocation: async (position) => {
      if (!passengerId || !currentRide?.id) return;

      try {
        await updatePassengerLiveLocation({
          passengerId,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      } catch (error: any) {
        if (error?.response?.status === 404 || error?.response?.status === 401) {
          setTrackingUnavailable(true);
          return;
        }

        console.log(
          'PASSENGER LOCATION UPDATE ERROR:',
          error?.response?.data || error?.message
        );
      }
    },
  });

  return {
    user,
    loadingUser,
    notLoggedIn,
    pickupLocation,
    destination,
    pickupCoords,
    destinationCoords,
    pickupSuggestions,
    destinationSuggestions,
    pickupLoading,
    destinationLoading,
    rideType,
    scheduledTime,
    passengerCount,
    luggageCount,
    message,
    coinBalance,
    currentRide,
    orderPlacedRide,
    trackingSnapshot,
    trackingUnavailable,
    pendingFeedbackRide,
    rating,
    wasDriverPolite,
    wasDriverOnTime,
    wasVehicleClean,
    luggageHandlingRating,
    comment,
    passengerRidePhase,
    shouldShowBottomSheet,
    isSearchingDriver,
    isCreatingRide,
    isRefreshingRide,
    isRefreshingTracking,
    isSubmittingFeedback,
    isCancellingRide,
    rideFareEstimate,
    isLoadingRideFareEstimate,
    mapRegion,
    rideSummary,
    handlePickupTextChange,
    handleDestinationTextChange,
    handleSelectPlace,
    handleReviewRide,
    handleCloseReviewRide,
    clearCompletedRideFlowState,
    setPassengerCount,
    setLuggageCount,
    setRideType,
    setScheduledTime,
    setRating,
    setWasDriverPolite,
    setWasDriverOnTime,
    setWasVehicleClean,
    setLuggageHandlingRating,
    setComment,
    handleGetCurrentRide,
    handleGetPendingFeedbackRide,
    handleGetRideFareEstimate,
    handleRefreshTrackingSnapshot,
    handleCreateRide,
    handleDismissOrderPlaced,
    handleSubmitFeedback,
    handleCancelRide,
  };
}
