import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
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
import { passengerStyles as styles } from '../../src/styles/passengerStyles';
import { isCancelledRideStatus } from '../../src/types/passenger';

export default function PassengerScreen() {
  const router = useRouter();
  const [isRideFormExpanded, setIsRideFormExpanded] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
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
    handleCancelRide,
  } = usePassengerScreen();

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
  const shouldShowFeedbackPrompt = hasCompletedRide && !!pendingFeedbackRide;
  const shouldShowCurrentRideCard =
    !!currentRide &&
    currentRide.status !== 'Pending' &&
    currentRide.status !== 'Completed' &&
    !isCancelledRideStatus(currentRide.status);
  const shouldShowOrderPlacedCard =
    (currentRide?.status === 'Pending' || orderPlacedRide?.status === 'Pending') &&
    !shouldShowCurrentRideCard &&
    !shouldShowFeedbackPrompt;
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
    !shouldShowOrderPlacedCard && !shouldShowFeedbackPrompt && !currentRide;
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
        coinBalance={coinBalance}
        profileImageStorageKey={profileImageStorageKey}
      />

      {message ? (
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
        ) : shouldShowFeedbackPrompt ? (
          <View style={styles.sectionSpacing}>
            <View style={styles.feedbackHeroCard}>
              <View style={styles.feedbackHeroIconWrap}>
                <MaterialCommunityIcons
                  name="star-circle-outline"
                  size={28}
                  color="#ca8a04"
                />
              </View>
              <Text style={styles.feedbackHeroTitle}>Rate Your Ride</Text>
              <Text style={styles.feedbackHeroSubtitle}>
                Your trip is complete. Leave quick feedback now and earn coins for your next rides.
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Completed Ride Ready For Review</Text>
              <Text style={styles.helperText}>
                Review the finished trip and share a short rating for your driver.
              </Text>

              <View style={styles.feedbackTripSummary}>
                <Text style={styles.feedbackTripRowLabel}>
                  Ride #{pendingFeedbackRide.id}
                </Text>
                <Text style={styles.feedbackTripRowValue}>
                  {pendingFeedbackRide.pickupLocation || 'Unknown pickup'}
                </Text>
                <Text style={styles.feedbackTripRowArrow}>to</Text>
                <Text style={styles.feedbackTripRowValue}>
                  {pendingFeedbackRide.destination || 'Unknown destination'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => router.push('/(main)/passenger-feedback')}
              >
                <Text style={styles.primaryButtonText}>Rate This Ride</Text>
              </TouchableOpacity>
            </View>
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
