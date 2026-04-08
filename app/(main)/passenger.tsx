import { Redirect, useRouter } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';

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
    handleDismissOrderPlaced,
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
      <AppNavbar fullName={user?.fullName} />

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
          <Text style={styles.coinsText}>🪙 {coinBalance} ₪</Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        {orderPlacedRide ? (
          <OrderPlacedCard
            rideSummary={orderPlacedRide.rideSummary}
            rideId={orderPlacedRide.rideId}
            status={orderPlacedRide.status}
            onTrackRide={() => router.push('/(main)/passenger-tracking')}
            onClose={handleDismissOrderPlaced}
          />
        ) : currentRide ? (
          <CurrentRideCard
            currentRide={currentRide}
            onRefreshRideStatus={handleGetCurrentRide}
            onTrackRide={() => router.push('/(main)/passenger-tracking')}
          />
        ) : (
          <RideDetailsCard
            pickupLocation={pickupLocation}
            setPickupLocation={handlePickupTextChange}
            destination={destination}
            setDestination={handleDestinationTextChange}
            pickupSuggestions={pickupSuggestions}
            destinationSuggestions={destinationSuggestions}
            pickupLoading={pickupLoading}
            destinationLoading={destinationLoading}
            onSelectPickupSuggestion={(item) =>
              handleSelectPlace(item, 'pickup')
            }
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
        )}
      </View>

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
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.searchingText}>
            Looking for a driver for you...
          </Text>
        </View>
      )}

      {message ? (
        <Text style={styles.message}>{message}</Text>
      ) : null}

      {shouldShowBottomSheet && (
        <PassengerBottomSheet
          rideSummary={rideSummary}
          rideType={rideType}
          pickupCoords={pickupCoords}
          destinationCoords={destinationCoords}
          onOrderNow={handleCreateRide}
        />
      )}
    </View>
  );
}
