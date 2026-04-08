import { Redirect } from 'expo-router';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

import AppNavbar from '../../src/components/AppNavbar';
import { useDriverScreen } from '../../src/hooks/useDriverScreen';
import { driverStyles as styles } from '../../src/styles/driverStyles';

export default function DriverScreen() {
  const {
    user,
    loadingUser,
    notLoggedIn,
    availableRides,
    currentRide,
    trackingSnapshot,
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
  } = useDriverScreen();

  if (notLoggedIn) {
    return <Redirect href="/(auth)" />;
  }

  if (loadingUser) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading driver data...</Text>
      </View>
    );
  }

  const pickupCoords =
    currentRide?.pickupLatitude != null && currentRide?.pickupLongitude != null
      ? {
          latitude: currentRide.pickupLatitude,
          longitude: currentRide.pickupLongitude,
        }
      : null;

  const destinationCoords =
    currentRide?.destinationLatitude != null &&
    currentRide?.destinationLongitude != null
      ? {
          latitude: currentRide.destinationLatitude,
          longitude: currentRide.destinationLongitude,
        }
      : null;

  const passengerCoords = trackingSnapshot?.passengerLocation
    ? {
        latitude: trackingSnapshot.passengerLocation.latitude,
        longitude: trackingSnapshot.passengerLocation.longitude,
      }
    : null;

  const targetCoords = navigationTarget.coords;
  const mapCenter =
    currentCoords ??
    targetCoords ??
    pickupCoords ??
    destinationCoords ?? {
      latitude: 32.0853,
      longitude: 34.7818,
    };

  return (
    <View style={styles.screen}>
      <AppNavbar fullName={user?.fullName} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Driver Dashboard</Text>
        <Text style={styles.helperText}>
          Live navigation switches from pickup to destination after you mark the
          rider as picked up.
        </Text>

        {message ? <Text style={styles.message}>{message}</Text> : null}
        {locationError ? <Text style={styles.message}>{locationError}</Text> : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Navigation</Text>

          <MapView
            style={styles.map}
            region={{
              latitude: mapCenter.latitude,
              longitude: mapCenter.longitude,
              latitudeDelta: 0.03,
              longitudeDelta: 0.03,
            }}
          >
            {pickupCoords ? (
              <Marker
                coordinate={pickupCoords}
                title="Pickup"
                description={currentRide?.pickupLocation}
                pinColor="green"
              />
            ) : null}

            {destinationCoords ? (
              <Marker
                coordinate={destinationCoords}
                title="Destination"
                description={currentRide?.destination}
                pinColor="red"
              />
            ) : null}

            {passengerCoords ? (
              <Marker
                coordinate={passengerCoords}
                title="Passenger"
                description="Passenger live location"
                pinColor="orange"
              />
            ) : null}

            {currentCoords ? (
              <Marker
                coordinate={currentCoords}
                title="You"
                description="Driver live location"
                pinColor="blue"
              />
            ) : null}

            {currentCoords && targetCoords ? (
              <Polyline
                coordinates={[currentCoords, targetCoords]}
                strokeWidth={4}
                strokeColor="#2563eb"
              />
            ) : null}
          </MapView>

          <View style={styles.statusBanner}>
            <Text style={styles.statusTitle}>{navigationTarget.title}</Text>
            <Text style={styles.helperText}>{navigationTarget.subtitle}</Text>
            <Text style={styles.helperText}>
              Ride status: {currentRide?.status || 'No active ride'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleOpenExternalNavigation}
          >
            <Text style={styles.actionButtonText}>Open Turn-by-Turn Navigation</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleRefreshTracking}
          >
            <Text style={styles.secondaryButtonText}>Refresh Live Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Available Rides</Text>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleGetAvailableRides}
          >
            <Text style={styles.secondaryButtonText}>Reload Available Rides</Text>
          </TouchableOpacity>

          {availableRides.length === 0 ? (
            <Text style={styles.helperText}>No available rides loaded.</Text>
          ) : (
            availableRides.map((ride) => (
              <View key={ride.id} style={styles.innerCard}>
                <Text>
                  <Text style={styles.label}>Ride Id:</Text> {ride.id}
                </Text>
                <Text>
                  <Text style={styles.label}>Pickup:</Text> {ride.pickupLocation}
                </Text>
                <Text>
                  <Text style={styles.label}>Destination:</Text> {ride.destination}
                </Text>
                <Text>
                  <Text style={styles.label}>Ride Type:</Text> {ride.rideType}
                </Text>
                <Text>
                  <Text style={styles.label}>Shared:</Text> {ride.isShared ? 'Yes' : 'No'}
                </Text>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleAcceptRide(ride.id)}
                >
                  <Text style={styles.actionButtonText}>Accept Ride</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Ride</Text>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleGetCurrentRide}
          >
            <Text style={styles.secondaryButtonText}>Refresh Current Ride</Text>
          </TouchableOpacity>

          {currentRide ? (
            <>
              <View style={styles.innerCard}>
                <Text>
                  <Text style={styles.label}>Ride Id:</Text> {currentRide.id}
                </Text>
                <Text>
                  <Text style={styles.label}>Passenger:</Text>{' '}
                  {currentRide.passengerName || currentRide.passengerId}
                </Text>
                <Text>
                  <Text style={styles.label}>Pickup:</Text> {currentRide.pickupLocation}
                </Text>
                <Text>
                  <Text style={styles.label}>Destination:</Text> {currentRide.destination}
                </Text>
                <Text>
                  <Text style={styles.label}>Status:</Text> {currentRide.status}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleUpdateRideStatus('OnTheWay')}
              >
                <Text style={styles.actionButtonText}>Mark On The Way</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleUpdateRideStatus('PickedUp')}
              >
                <Text style={styles.actionButtonText}>Mark Picked Up</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleUpdateRideStatus('Completed')}
              >
                <Text style={styles.actionButtonText}>Mark Completed</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.helperText}>No current ride loaded.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
