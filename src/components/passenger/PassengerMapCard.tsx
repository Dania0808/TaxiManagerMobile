import { Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import { passengerStyles as styles } from '../../styles/passengerStyles';
import { CurrentRideType, LatLng } from '../../types/passenger';
import { RideTrackingSnapshot } from '../../types/liveTracking';

type PassengerMapCardProps = {
  mapRegion: Region;
  pickupCoords: LatLng | null;
  destinationCoords: LatLng | null;
  pickupLocation: string;
  destination: string;
  currentRide: CurrentRideType | null;
  trackingSnapshot?: RideTrackingSnapshot | null;
};

function getActiveRideCopy(status?: string) {
  if (status === 'Pending') {
    return {
      title: 'Finding your driver',
      subtitle: 'We are matching your request with the best nearby driver.',
    };
  }

  if (status === 'Accepted') {
    return {
      title: 'Driver assigned',
      subtitle: 'Your ride is confirmed. The map will update as the trip goes live.',
    };
  }

  if (status === 'OnTheWay') {
    return {
      title: 'Driver on the way',
      subtitle: 'Your driver is moving toward pickup right now.',
    };
  }

  if (status === 'PickedUp') {
    return {
      title: 'Trip in progress',
      subtitle: 'You are on the way. Follow the route live on this screen.',
    };
  }

  return {
    title: 'Ride in progress',
    subtitle: 'Your live ride details appear here.',
  };
}

export default function PassengerMapCard({
  mapRegion,
  pickupCoords,
  destinationCoords,
  pickupLocation,
  destination,
  currentRide,
  trackingSnapshot,
}: PassengerMapCardProps) {
  const hasActiveRide =
    !!currentRide &&
    currentRide.status !== 'Completed' &&
    currentRide.status !== 'Cancelled';
  const livePickupCoords = trackingSnapshot?.pickupCoords ?? pickupCoords;
  const liveDestinationCoords = trackingSnapshot?.destinationCoords ?? destinationCoords;
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
  const hasFreshPlannedRoute =
    !hasActiveRide &&
    !!pickupLocation.trim() &&
    !!destination.trim() &&
    !!livePickupCoords &&
    !!liveDestinationCoords;
  const routeCoordinates =
    hasActiveRide && driverCoords
      ? currentRide?.status === 'PickedUp' && liveDestinationCoords
        ? [driverCoords, liveDestinationCoords]
        : livePickupCoords
          ? [driverCoords, livePickupCoords]
          : []
      : hasFreshPlannedRoute
        ? [livePickupCoords, liveDestinationCoords]
        : [];
  const activeRideCopy = getActiveRideCopy(currentRide?.status);
  const overlayTitle = hasActiveRide ? activeRideCopy.title : 'Plan your route';
  const overlayIcon = hasActiveRide ? 'car-connected' : 'map-marker-path';
  const overlayBadge = hasActiveRide
    ? currentRide?.status === 'PickedUp'
      ? 'On trip'
      : currentRide?.status === 'OnTheWay'
        ? 'Driver coming'
        : currentRide?.status === 'Accepted'
          ? 'Driver found'
          : 'Live'
    : hasFreshPlannedRoute
      ? 'Route ready'
      : 'Start here';
  const overlaySubtitle = hasActiveRide
    ? activeRideCopy.subtitle
    : hasFreshPlannedRoute
      ? 'Pickup and destination are pinned on the map.'
      : 'Choose where you want to be picked up and where you are going.';

  return (
    <View style={styles.mapHeroCard}>
      <MapView style={styles.mapHero} region={mapRegion}>
        {(hasActiveRide || hasFreshPlannedRoute) && livePickupCoords && (
          <Marker
            coordinate={livePickupCoords}
            title="Pickup"
            description={pickupLocation}
            pinColor="green"
          />
        )}

        {(hasActiveRide || hasFreshPlannedRoute) && liveDestinationCoords && (
          <Marker
            coordinate={liveDestinationCoords}
            title="Destination"
            description={destination}
            pinColor="red"
          />
        )}

        {passengerCoords && hasActiveRide ? (
          <Marker
            coordinate={passengerCoords}
            title="You"
            description="Passenger live location"
            pinColor="orange"
          />
        ) : null}

        {driverCoords && hasActiveRide ? (
          <Marker
            coordinate={driverCoords}
            title={trackingSnapshot?.driverName || 'Driver'}
            description="Driver live location"
            pinColor="blue"
          />
        ) : null}

        {routeCoordinates.length === 2 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={5}
            strokeColor="#2563eb"
          />
        )}

      </MapView>

      <View style={styles.mapOverlayInfo}>
        <View style={styles.mapOverlayTopRow}>
          <View style={styles.mapOverlayHeader}>
            <View style={styles.mapOverlayIconWrap}>
              <MaterialCommunityIcons
                name={overlayIcon}
                size={18}
                color="#111827"
              />
            </View>
            <Text style={styles.mapOverlayTitle}>{overlayTitle}</Text>
          </View>
          <View style={styles.mapOverlayBadge}>
            <Text style={styles.mapOverlayBadgeText}>{overlayBadge}</Text>
          </View>
        </View>

        <Text style={styles.mapOverlaySubtitle}>{overlaySubtitle}</Text>
        <View style={styles.mapOverlayMetaRow}>
          {hasActiveRide && currentRide?.driverId ? (
            <>
              <View style={styles.mapOverlayMetaPill}>
                <Text style={styles.mapOverlayMetaText}>
                  {trackingSnapshot?.driverName || currentRide.driverName || 'Driver assigned'}
                </Text>
              </View>
              <View style={styles.mapOverlayMetaPill}>
                <Text style={styles.mapOverlayMetaText}>
                  {currentRide.status === 'PickedUp' ? 'Destination route' : 'Pickup route'}
                </Text>
              </View>
            </>
          ) : null}
          {!hasActiveRide && hasFreshPlannedRoute && livePickupCoords ? (
            <View style={styles.mapOverlayMetaPill}>
              <Text style={styles.mapOverlayMetaText}>Pickup pinned</Text>
            </View>
          ) : null}
          {!hasActiveRide && hasFreshPlannedRoute && liveDestinationCoords ? (
            <View style={styles.mapOverlayMetaPill}>
              <Text style={styles.mapOverlayMetaText}>Destination pinned</Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}
