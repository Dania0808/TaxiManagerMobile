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
import { usePassengerScreen } from '../../src/hooks/usePassengerScreen';
import { passengerStyles as styles } from '../../src/styles/passengerStyles';

export default function PassengerScreen() {
  const router = useRouter();
  const [isRideFormExpanded, setIsRideFormExpanded] = useState(true);
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
    passengerRidePhase,
    shouldShowBottomSheet,
    isSearchingDriver,
    isCreatingRide,
    isRefreshingRide,
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
  const shouldShowCurrentRideCard =
    !!currentRide && currentRide.status !== 'Pending' && currentRide.status !== 'Completed';
  const shouldShowOrderPlacedCard =
    (!!orderPlacedRide || currentRide?.status === 'Pending') && !shouldShowCurrentRideCard;

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
        <View style={styles.mapSection}>
          <PassengerMapCard
            mapRegion={mapRegion}
            pickupCoords={pickupCoords}
            destinationCoords={destinationCoords}
            pickupLocation={pickupLocation}
            destination={destination}
            currentRide={currentRide}
          />
        </View>

        {shouldShowOrderPlacedCard ? (
          <View style={styles.sectionSpacing}>
            <OrderPlacedCard
              rideSummary={orderPlacedRide?.rideSummary || rideSummary}
              rideId={orderPlacedRide?.rideId || currentRide?.id}
              status={orderPlacedRide?.status || currentRide?.status}
              onRefreshRideStatus={handleGetCurrentRide}
              onTrackRide={() => router.push('/(main)/passenger-tracking')}
            />
          </View>
        ) : currentRide && !hasCompletedRide ? (
          <View style={styles.sectionSpacing}>
            <CurrentRideCard
              currentRide={currentRide}
              onRefreshRideStatus={handleGetCurrentRide}
              isRefreshing={isRefreshingRide}
              onTrackRide={() => router.push('/(main)/passenger-tracking')}
            />
          </View>
        ) : (
          <KeyboardAvoidingView
            style={styles.rideComposerContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}
          >
            <View style={styles.rideComposerCard}>
              <TouchableOpacity
                style={styles.floatingFormHeader}
                activeOpacity={0.9}
                onPress={() => setIsRideFormExpanded((value) => !value)}
              >
                <View style={styles.floatingHeaderRow}>
                  <View style={styles.rideComposerTextWrap}>
                    <Text style={styles.floatingFormTitle}>Ride Details</Text>
                    <Text style={styles.floatingFormSubtitle}>
                      {pickupLocation || destination
                        ? 'Your draft is saved here. Tap to continue editing.'
                        : 'Add your pickup, destination, and trip preferences to continue.'}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name={isRideFormExpanded ? 'chevron-down' : 'chevron-up'}
                    size={24}
                    color="#111827"
                  />
                </View>
              </TouchableOpacity>

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
    </View>
  );
}
