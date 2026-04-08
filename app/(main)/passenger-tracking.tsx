import { Redirect } from 'expo-router';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import AppNavbar from '../../src/components/AppNavbar';
import { usePassengerScreen } from '../../src/hooks/usePassengerScreen';
import { passengerStyles as styles } from '../../src/styles/passengerStyles';

export default function PassengerTrackingScreen() {
  const {
    user,
    loadingUser,
    notLoggedIn,
    currentRide,
    trackingSnapshot,
    trackingUnavailable,
    handleGetCurrentRide,
    handleRefreshTrackingSnapshot,
  } = usePassengerScreen();

  if (notLoggedIn) {
    return <Redirect href="/(auth)" />;
  }

  if (loadingUser) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading tracking...</Text>
      </View>
    );
  }

  const pickupCoords = trackingSnapshot?.pickupCoords ??
    (currentRide?.pickupLatitude != null && currentRide?.pickupLongitude != null
      ? {
          latitude: currentRide.pickupLatitude,
          longitude: currentRide.pickupLongitude,
        }
      : null);

  const destinationCoords = trackingSnapshot?.destinationCoords ??
    (currentRide?.destinationLatitude != null &&
    currentRide?.destinationLongitude != null
      ? {
          latitude: currentRide.destinationLatitude,
          longitude: currentRide.destinationLongitude,
        }
      : null);

  const driverCoords = trackingSnapshot?.driverLocation
    ? {
        latitude: trackingSnapshot.driverLocation.latitude,
        longitude: trackingSnapshot.driverLocation.longitude,
      }
    : null;

  const passengerCoords = trackingSnapshot?.passengerLocation
    ? {
        latitude: trackingSnapshot.passengerLocation.latitude,
        longitude: trackingSnapshot.passengerLocation.longitude,
      }
    : null;

  const mapCenter =
    driverCoords ??
    pickupCoords ??
    destinationCoords ?? {
      latitude: 32.0853,
      longitude: 34.7818,
    };

  const routeTarget =
    currentRide?.status === 'PickedUp' ? destinationCoords : pickupCoords;

  return (
    <View style={styles.screen}>
      <AppNavbar fullName={user?.fullName} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Track Your Driver</Text>
          <Text style={styles.helperText}>
            This page shows the driver&apos;s live position and the current trip
            stage.
          </Text>

          {trackingUnavailable ? (
            <View style={styles.statusBanner}>
              <Text style={styles.statusTitle}>Live tracking not available yet</Text>
              <Text style={styles.helperText}>
                Your backend does not expose the tracking endpoints yet, so the
                map will show ride points only.
              </Text>
            </View>
          ) : null}

          <MapView
            style={styles.trackingMap}
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
                title="You"
                description="Passenger live location"
                pinColor="orange"
              />
            ) : null}

            {driverCoords ? (
              <Marker
                coordinate={driverCoords}
                title={trackingSnapshot?.driverName || 'Driver'}
                description="Driver live location"
                pinColor="blue"
              />
            ) : null}

            {driverCoords && routeTarget ? (
              <Polyline
                coordinates={[driverCoords, routeTarget]}
                strokeWidth={4}
                strokeColor="#2563eb"
              />
            ) : null}
          </MapView>

          <View style={styles.statusBanner}>
            <Text style={styles.statusTitle}>
              {currentRide?.status === 'Pending' &&
                'Your request is waiting for a driver.'}
              {currentRide?.status === 'Accepted' &&
                'A driver accepted your ride.'}
              {currentRide?.status === 'OnTheWay' &&
                'Your driver is heading to pickup.'}
              {currentRide?.status === 'PickedUp' &&
                'You are on the way to your destination.'}
              {currentRide?.status === 'Completed' && 'Ride completed.'}
            </Text>
            <Text style={styles.helperText}>
              Status: {currentRide?.status || 'Unknown'}
            </Text>
          </View>

          <View style={styles.rideDetailsBox}>
            <Text>
              <Text style={styles.bold}>Ride Id:</Text> {currentRide?.id ?? '-'}
            </Text>
            <Text>
              <Text style={styles.bold}>Driver:</Text>{' '}
              {trackingSnapshot?.driverName || currentRide?.driverName || 'Not assigned yet'}
            </Text>
            <Text>
              <Text style={styles.bold}>Car:</Text>{' '}
              {trackingSnapshot?.carModel || currentRide?.carModel || 'Not available'}
            </Text>
            <Text>
              <Text style={styles.bold}>Pickup:</Text> {currentRide?.pickupLocation || '-'}
            </Text>
            <Text>
              <Text style={styles.bold}>Destination:</Text> {currentRide?.destination || '-'}
            </Text>
          </View>

          <View style={styles.orderButtonWrap}>
            <Text style={styles.linkButton} onPress={handleGetCurrentRide}>
              Refresh ride status
            </Text>
          </View>

          <View style={styles.orderButtonWrap}>
            <Text style={styles.linkButton} onPress={handleRefreshTrackingSnapshot}>
              Refresh live locations
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
