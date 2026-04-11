import { Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { passengerStyles as styles } from '../../styles/passengerStyles';
import { LatLng, RideSummary, RideType } from '../../types/passenger';

type PassengerBottomSheetProps = {
  rideSummary: RideSummary;
  rideType: RideType;
  pickupCoords?: LatLng | null;
  destinationCoords?: LatLng | null;
  onBack: () => void;
  onOrderNow: () => void;
  isSubmitting?: boolean;
};

export default function PassengerBottomSheet({
  rideSummary,
  rideType,
  pickupCoords,
  destinationCoords,
  onBack,
  onOrderNow,
  isSubmitting = false,
}: PassengerBottomSheetProps) {
  const hasRoute = !!pickupCoords && !!destinationCoords;

  const previewRegion = hasRoute
    ? {
        latitude: (pickupCoords!.latitude + destinationCoords!.latitude) / 2,
        longitude: (pickupCoords!.longitude + destinationCoords!.longitude) / 2,
        latitudeDelta: Math.max(
          Math.abs(pickupCoords!.latitude - destinationCoords!.latitude) * 1.8,
          0.02
        ),
        longitudeDelta: Math.max(
          Math.abs(pickupCoords!.longitude - destinationCoords!.longitude) * 1.8,
          0.02
        ),
      }
    : {
        latitude: 32.0853,
        longitude: 34.7818,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

  return (
      <View style={styles.bottomSheetBackdrop}>
      <View style={styles.bottomSheet}>
        <View style={styles.bottomSheetContent}>
          <Text style={styles.bottomTitle}>Review Your Ride</Text>
          <Text style={styles.formSubtitle}>
            Check your trip details before sending the request to nearby drivers.
          </Text>

          {hasRoute && (
            <View style={styles.bottomMapWrapper}>
              <MapView style={styles.bottomMap} region={previewRegion}>
                <Marker
                  coordinate={pickupCoords!}
                  title="Pickup"
                  description={rideSummary.from}
                  pinColor="green"
                />

                <Marker
                  coordinate={destinationCoords!}
                  title="Destination"
                  description={rideSummary.to}
                  pinColor="red"
                />

                <Polyline
                  coordinates={[pickupCoords!, destinationCoords!]}
                  strokeWidth={4}
                  strokeColor="#2563eb"
                />
              </MapView>
            </View>
          )}

          <View style={styles.rideDetailsBox}>
            <View style={styles.bottomSheetRow}>
              <Text style={styles.bottomLabel}>From</Text>
              <Text style={styles.bottomValue}>{rideSummary.from}</Text>
            </View>

            <View style={styles.bottomSheetRow}>
              <Text style={styles.bottomLabel}>To</Text>
              <Text style={styles.bottomValue}>{rideSummary.to}</Text>
            </View>

            <View style={styles.bottomSheetRow}>
              <Text style={styles.bottomLabel}>Passengers</Text>
              <Text style={styles.bottomValue}>{rideSummary.passengers}</Text>
            </View>

            <View style={styles.bottomSheetRow}>
              <Text style={styles.bottomLabel}>Bags</Text>
              <Text style={styles.bottomValue}>{rideSummary.luggage}</Text>
            </View>

            <View style={styles.bottomSheetRow}>
              <Text style={styles.bottomLabel}>Ride Type</Text>
              <Text style={styles.bottomValue}>{rideSummary.rideType}</Text>
            </View>

            {rideType === 'Immediate' && (
              <View style={styles.bottomSheetRow}>
                <Text style={styles.bottomLabel}>Shared Ride</Text>
                <Text style={styles.bottomValue}>{rideSummary.shared}</Text>
              </View>
            )}

            {rideType === 'Scheduled' && (
              <View style={styles.bottomSheetRow}>
                <Text style={styles.bottomLabel}>Scheduled</Text>
                <Text style={styles.bottomValue}>{rideSummary.scheduledTime}</Text>
              </View>
            )}
          </View>

          <View style={styles.bottomButtonWrap}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                isSubmitting && styles.primaryButtonDisabled,
              ]}
              onPress={onOrderNow}
              disabled={isSubmitting}
            >
              <Text style={styles.primaryButtonText}>
                {isSubmitting ? 'Sending request...' : 'Order Now'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomBackRow}>
            <TouchableOpacity onPress={onBack} style={styles.bottomBackButton}>
              <Text style={styles.bottomBackHint}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
