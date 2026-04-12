import { Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import { passengerStyles as styles } from '../../styles/passengerStyles';
import { CurrentRideType, LatLng } from '../../types/passenger';

type PassengerMapCardProps = {
  mapRegion: Region;
  pickupCoords: LatLng | null;
  destinationCoords: LatLng | null;
  pickupLocation: string;
  destination: string;
  currentRide: CurrentRideType | null;
};

export default function PassengerMapCard({
  mapRegion,
  pickupCoords,
  destinationCoords,
  pickupLocation,
  destination,
  currentRide,
}: PassengerMapCardProps) {
  const routeCoordinates =
    pickupCoords && destinationCoords
      ? [pickupCoords, destinationCoords]
      : [];
  const hasActiveRide =
    !!currentRide &&
    currentRide.status !== 'Completed' &&
    currentRide.status !== 'Cancelled';
  const overlayTitle = hasActiveRide ? 'Ride in progress' : 'Plan your route';
  const overlayIcon = hasActiveRide ? 'car-connected' : 'map-marker-path';
  const overlaySubtitle = hasActiveRide
    ? 'We will show live tracking here when driver updates are available.'
    : pickupCoords && destinationCoords
      ? 'Your pickup and destination are pinned. Review the route before booking.'
      : 'Choose your pickup and destination to preview the ride path.';

  return (
    <View style={styles.mapHeroCard}>
      <MapView style={styles.mapHero} region={mapRegion}>
        {pickupCoords && (
          <Marker
            coordinate={pickupCoords}
            title="Pickup"
            description={pickupLocation}
            pinColor="green"
          />
        )}

        {destinationCoords && (
          <Marker
            coordinate={destinationCoords}
            title="Destination"
            description={destination}
            pinColor="red"
          />
        )}

        {routeCoordinates.length === 2 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={5}
            strokeColor="#2563eb"
          />
        )}

      </MapView>

      <View style={styles.mapOverlayInfo}>
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

        <Text style={styles.mapOverlaySubtitle}>{overlaySubtitle}</Text>
      </View>
    </View>
  );
}
