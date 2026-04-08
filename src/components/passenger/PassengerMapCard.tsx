import { Text, View } from 'react-native';
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

        {currentRide?.driverId && pickupCoords && (
          <Marker
            coordinate={pickupCoords}
            title="Driver heading to pickup"
            description="Live driver location will connect here next phase"
            pinColor="blue"
          />
        )}
      </MapView>

      <View style={styles.mapOverlayInfo}>
        <Text style={styles.mapOverlayTitle}>Trip Map</Text>
        <Text style={styles.mapOverlaySubtitle}>
          {pickupCoords && destinationCoords
            ? 'Pickup and destination selected'
            : 'Choose your trip locations to preview the route'}
        </Text>
      </View>
    </View>
  );
}