import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AppNavbar from '../../src/components/AppNavbar';
import CurrentRideCard from '../../src/components/passenger/CurrentRideCard';
import OrderPlacedCard from '../../src/components/passenger/OrderPlacedCard';
import PassengerBottomSheet from '../../src/components/passenger/PassengerBottomSheet';
import PassengerMapCard from '../../src/components/passenger/PassengerMapCard';
import RideDetailsCard from '../../src/components/passenger/RideDetailsCard';
import CancelRideModal from '../../src/components/shared/CancelRideModal';
import { usePassengerScreen } from '../../src/hooks/usePassengerScreen';
import { getRidePaymentStatus } from '../../src/services/passengerService';
import { passengerStyles as styles } from '../../src/styles/passengerStyles';
import { isCancelledRideStatus } from '../../src/types/passenger';

export default function PassengerScreen() {
  const router = useRouter();
  const { notificationRefreshAt } = useLocalSearchParams<{
    notificationRefreshAt?: string;
  }>();
  const [isRideFormExpanded, setIsRideFormExpanded] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCompletedRidePaid, setIsCompletedRidePaid] = useState(false);
  const {
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
    isShared,
    scheduledTime,
    passengerCount,
    luggageCount,
    message,
    coinBalance,
    currentRide,
    orderPlacedRide,
    trackingSnapshot,
    pendingFeedbackRide,
    passengerRidePhase,
    shouldShowBottomSheet,
    isSearchingDriver,
    isCreatingRide,
    isRefreshingRide,
    isCancellingRide,
    mapRegion,
    rideSummary,
    handlePickupTextChange,
    handleDestinationTextChange,
    handleSelectPlace,
    handleReviewRide,
    handleCloseReviewRide,
    setPassengerCount,
    setLuggageCount,
    setRideType,
    setScheduledTime,
    setIsShared,
    handleCreateRide,
    handleGetCurrentRide,
    handleGetPendingFeedbackRide,
    handleCancelRide,
  } = usePassengerScreen();

  useEffect(() => {
    if (!notificationRefreshAt) return;

    handleGetCurrentRide();
    handleGetPendingFeedbackRide();
  }, [notificationRefreshAt, handleGetCurrentRide, handleGetPendingFeedbackRide]);

  useEffect(() => {
    const syncCompletedRidePaymentFlow = async () => {
      if (
        currentRide?.status !== 'Completed' ||
        !pendingFeedbackRide?.id ||
        !user?.passengerId
      ) {
        setIsCompletedRidePaid(false);
        return;
      }

      try {
        const paymentStatus = await getRidePaymentStatus(
          pendingFeedbackRide.id,
          user.passengerId
        );
        const isPaid = paymentStatus?.status?.toLowerCase() === 'paid';
        setIsCompletedRidePaid(isPaid);

        if (!isPaid) {
          router.replace({
            pathname: '/(main)/passenger-payment',
            params: { rideId: String(pendingFeedbackRide.id) },
          });
        }
      } catch {
        setIsCompletedRidePaid(false);
        router.replace({
          pathname: '/(main)/passenger-payment',
          params: { rideId: String(pendingFeedbackRide.id) },
        });
      }
    };

    syncCompletedRidePaymentFlow();
  }, [currentRide?.status, pendingFeedbackRide?.id, router, user?.passengerId]);

  if (notLoggedIn) {
    return <Redirect href="/(auth)" />;
  }

  if (loadingUser) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  const profileImageStorageKey = user?.passengerId
    ? `passenger_profile_image_url_${user.passengerId}`
    : undefined;
  const hasCompletedRide = currentRide?.status === 'Completed';
  const shouldShowCurrentRideCard =
    !!currentRide &&
    currentRide.status !== 'Pending' &&
    currentRide.status !== 'Completed' &&
    !isCancelledRideStatus(currentRide.status);
  const shouldShowOrderPlacedCard =
    (currentRide?.status === 'Pending' || orderPlacedRide?.status === 'Pending') &&
    !shouldShowCurrentRideCard &&
    !hasCompletedRide;
  const isLiveRidePhase =
    currentRide?.status === 'Accepted' ||
    currentRide?.status === 'OnTheWay' ||
    currentRide?.status === 'PickedUp';
  const passengerCancelReasons =
    currentRide?.status === 'Accepted' || currentRide?.status === 'OnTheWay'
      ? [
          'Changed my mind',
          'Driver taking too long',
          'Booked by mistake',
          'Found another ride',
        ]
      : ['Changed my mind', 'Booked by mistake', 'Found another ride'];
  const isPlanningState =
    !shouldShowOrderPlacedCard && !currentRide;
  const shouldShowPassengerMessageBanner =
    !!message &&
    (message.includes('missing') ||
      message.toLowerCase().includes('failed') ||
      message.toLowerCase().includes('error'));
  const pendingRideSummary =
    orderPlacedRide?.rideSummary ??
    (currentRide
      ? {
          from: currentRide.pickupLocation || 'Not set',
          to: currentRide.destination || 'Not set',
          rideType:
            currentRide.rideType === 'Scheduled' ? 'Scheduled' : 'Immediate',
          passengers: '1',
          luggage: '0',
          shared: currentRide.isShared ? 'Yes' : 'No',
          scheduledTime: '-',
        }
      : rideSummary);

  return (
    <View style={styles.screen}>
      <AppNavbar
        fullName={user?.fullName}
        profileRoute="/(main)/passenger-profile"
        notificationsRoute="/(main)/notifications"
        coinBalance={coinBalance}
        profileImageStorageKey={profileImageStorageKey}
      />

      {shouldShowPassengerMessageBanner ? (
        <View
          style={[
            styles.inlineBanner,
            passengerRidePhase === 'planning'
              ? styles.infoBanner
              : styles.successBanner,
          ]}
        >
          <Text style={styles.globalBannerTitle}>
            {passengerRidePhase === 'planning'
              ? 'Update'
              : passengerRidePhase === 'searching' || passengerRidePhase === 'waiting_match'
                ? 'Ride Status'
                : 'Latest Update'}
          </Text>
          <Text style={styles.globalBannerText}>{message}</Text>
        </View>
      ) : null}

      <ScrollView
        style={styles.mainContent}
        contentContainerStyle={styles.passengerScrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.mapSection, isPlanningState && styles.mapSectionPlanning]}>
          <PassengerMapCard
            mapRegion={mapRegion}
            pickupCoords={pickupCoords}
            destinationCoords={destinationCoords}
            pickupLocation={pickupLocation}
            destination={destination}
            currentRide={currentRide}
            trackingSnapshot={trackingSnapshot}
          />
        </View>

        {shouldShowOrderPlacedCard ? (
          <View style={styles.sectionSpacing}>
            <OrderPlacedCard
              rideSummary={pendingRideSummary}
              rideId={orderPlacedRide?.rideId || currentRide?.id}
              status={orderPlacedRide?.status || currentRide?.status}
              onRefreshRideStatus={handleGetCurrentRide}
              onTrackRide={
                currentRide?.status === 'Accepted'
                  ? () => router.push('/(main)/passenger-tracking')
                  : undefined
              }
              onCancelRide={() => setIsCancelModalOpen(true)}
              isCancelling={isCancellingRide}
            />
          </View>
        ) : currentRide && !hasCompletedRide ? (
          <View style={styles.sectionSpacing}>
            {isLiveRidePhase ? (
              <View style={styles.liveRideHomeBanner}>
                <View style={styles.liveRideHomeBannerIconWrap}>
                  <MaterialCommunityIcons name="map-clock-outline" size={18} color="#111827" />
                </View>
                <View style={styles.liveRideHomeBannerTextWrap}>
                  <Text style={styles.liveRideHomeBannerTitle}>Live ride in progress</Text>
                  <Text style={styles.liveRideHomeBannerText}>
                    This home screen now shows a summary. Open live tracking for the full map experience and live movement.
                  </Text>
                </View>
              </View>
            ) : null}
            <CurrentRideCard
              currentRide={currentRide}
              onRefreshRideStatus={handleGetCurrentRide}
              isRefreshing={isRefreshingRide}
              onCancelRide={
                currentRide?.status === 'PickedUp' ? undefined : () => setIsCancelModalOpen(true)
              }
              isCancelling={isCancellingRide}
            />
          </View>
        ) : hasCompletedRide && pendingFeedbackRide && isCompletedRidePaid ? (
          <View style={styles.sectionSpacing}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Ride completed</Text>
              <Text style={styles.helperText}>
                Payment is already confirmed. If you want, you can still leave optional feedback from the payment flow.
              </Text>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() =>
                  router.push({
                    pathname: '/(main)/passenger-feedback',
                    params: { rideId: String(pendingFeedbackRide.id) },
                  })
                }
              >
                <Text style={styles.secondaryButtonText}>Open Feedback</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <KeyboardAvoidingView
            style={styles.rideComposerContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}
          >
            <View style={styles.rideComposerCard}>
              {isRideFormExpanded ? (
                <RideDetailsCard
                  pickupLocation={pickupLocation}
                  setPickupLocation={handlePickupTextChange}
                  destination={destination}
                  setDestination={handleDestinationTextChange}
                  pickupSuggestions={pickupSuggestions}
                  destinationSuggestions={destinationSuggestions}
                  pickupLoading={pickupLoading}
                  destinationLoading={destinationLoading}
                  onSelectPickupSuggestion={(item) => handleSelectPlace(item, 'pickup')}
                  onSelectDestinationSuggestion={(item) =>
                    handleSelectPlace(item, 'destination')
                  }
                  passengerCount={passengerCount}
                  setPassengerCount={setPassengerCount}
                  luggageCount={luggageCount}
                  setLuggageCount={setLuggageCount}
                  rideType={rideType}
                  setRideType={setRideType}
                  scheduledTime={scheduledTime}
                  setScheduledTime={setScheduledTime}
                  isShared={isShared}
                  setIsShared={setIsShared}
                  onReviewRide={handleReviewRide}
                />
              ) : (
                <View style={styles.collapsedFormSummary}>
                  <Text style={styles.collapsedFormText}>
                    {pickupLocation || destination
                      ? `${pickupLocation || 'Pickup'} -> ${destination || 'Destination'}`
                      : 'Tap above to start entering your ride details.'}
                  </Text>
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
        )}

      </ScrollView>

      {isSearchingDriver && (
        <View style={styles.searchingBox}>
          <ActivityIndicator size="large" color="#111827" />
          <Text style={styles.searchingText}>
            {isCreatingRide ? 'Sending your ride request...' : 'Looking for a driver for you...'}
          </Text>
          <Text style={styles.searchingHelperText}>
            {isCreatingRide
              ? 'We are creating your trip and preparing the live status updates.'
              : 'We will automatically update this screen once a driver accepts.'}
          </Text>
        </View>
      )}

      {shouldShowBottomSheet && (
        <PassengerBottomSheet
          rideSummary={rideSummary}
          rideType={rideType}
          pickupCoords={pickupCoords}
          destinationCoords={destinationCoords}
          onBack={handleCloseReviewRide}
          onOrderNow={handleCreateRide}
          isSubmitting={isCreatingRide}
        />
      )}

      <CancelRideModal
        visible={isCancelModalOpen}
        title="Cancel this ride?"
        subtitle="You can cancel while the ride is pending or before pickup. Once the trip starts, cancellation is no longer available here."
        confirmLabel="Confirm cancellation"
        reasons={passengerCancelReasons}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={async (reason, note) => {
          const success = await handleCancelRide(reason, note);
          if (success) {
            setIsCancelModalOpen(false);
          }
        }}
        isSubmitting={isCancellingRide}
      />
    </View>
  );
}
