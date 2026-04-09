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
import FeedbackCard from '../../src/components/passenger/FeedbackCard';
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
    pendingFeedbackRide,
    rating,
    wasDriverPolite,
    wasDriverOnTime,
    wasVehicleClean,
    luggageHandlingRating,
    comment,
    shouldShowBottomSheet,
    isSearchingDriver,
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
    setRating,
    setWasDriverPolite,
    setWasDriverOnTime,
    setWasVehicleClean,
    setLuggageHandlingRating,
    setComment,
    handleCreateRide,
    handleGetCurrentRide,
    handleSubmitFeedback,
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

  return (
    <View style={styles.screen}>
      <AppNavbar
        fullName={user?.fullName}
        profileRoute="/(main)/passenger-profile"
      />

      <View style={styles.mapContainer}>
        <PassengerMapCard
          mapRegion={mapRegion}
          pickupCoords={pickupCoords}
          destinationCoords={destinationCoords}
          pickupLocation={pickupLocation}
          destination={destination}
          currentRide={currentRide}
        />

        <View style={styles.coinsOverlay}>
          <MaterialCommunityIcons name="cash-multiple" size={18} color="#111827" />
          <Text style={styles.coinsText}>{coinBalance} shekels</Text>
        </View>
      </View>

      {orderPlacedRide ? (
        <View style={styles.formContainer}>
          <OrderPlacedCard
            rideSummary={orderPlacedRide.rideSummary}
            rideId={orderPlacedRide.rideId}
            status={orderPlacedRide.status}
            onTrackRide={() => router.push('/(main)/passenger-tracking')}
          />
        </View>
      ) : currentRide ? (
        <View style={styles.formContainer}>
          <CurrentRideCard
            currentRide={currentRide}
            onRefreshRideStatus={handleGetCurrentRide}
            onTrackRide={() => router.push('/(main)/passenger-tracking')}
          />
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.floatingFormContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 12}
        >
          <View style={styles.floatingFormCard}>
            <TouchableOpacity
              style={styles.floatingFormHeader}
              activeOpacity={0.9}
              onPress={() => setIsRideFormExpanded((value) => !value)}
            >
              <View style={styles.floatingHandle} />
              <View style={styles.floatingHeaderRow}>
                <View>
                  <Text style={styles.floatingFormTitle}>Ride Details</Text>
                  <Text style={styles.floatingFormSubtitle}>
                    {pickupLocation || destination
                      ? 'Your draft is saved here. Tap to continue editing.'
                      : 'Tap to enter your pickup, destination, and trip details.'}
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
              <ScrollView
                style={styles.floatingFormScroll}
                contentContainerStyle={styles.floatingFormScrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
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
              </ScrollView>
            ) : (
              <View style={styles.collapsedFormSummary}>
                <Text style={styles.collapsedFormText}>
                  {pickupLocation || destination
                    ? `${pickupLocation || 'Pickup'} -> ${destination || 'Destination'}`
                    : 'Your ride form is collapsed. Tap above to continue.'}
                </Text>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      )}

      {pendingFeedbackRide && (
        <FeedbackCard
          pendingFeedbackRide={pendingFeedbackRide}
          rating={rating}
          setRating={setRating}
          wasDriverPolite={wasDriverPolite}
          setWasDriverPolite={setWasDriverPolite}
          wasDriverOnTime={wasDriverOnTime}
          setWasDriverOnTime={setWasDriverOnTime}
          wasVehicleClean={wasVehicleClean}
          setWasVehicleClean={setWasVehicleClean}
          luggageHandlingRating={luggageHandlingRating}
          setLuggageHandlingRating={setLuggageHandlingRating}
          comment={comment}
          setComment={setComment}
          onSubmitFeedback={handleSubmitFeedback}
        />
      )}

      {isSearchingDriver && (
        <View style={styles.searchingBox}>
          <ActivityIndicator size="large" color="#111827" />
          <Text style={styles.searchingText}>Looking for a driver for you...</Text>
        </View>
      )}

      {message ? <Text style={styles.message}>{message}</Text> : null}

      {shouldShowBottomSheet && (
        <PassengerBottomSheet
          rideSummary={rideSummary}
          rideType={rideType}
          pickupCoords={pickupCoords}
          destinationCoords={destinationCoords}
          onBack={handleCloseReviewRide}
          onOrderNow={handleCreateRide}
        />
      )}
    </View>
  );
}
