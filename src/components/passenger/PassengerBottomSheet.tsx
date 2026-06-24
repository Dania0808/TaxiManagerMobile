import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { passengerStyles as styles } from '../../styles/passengerStyles';
import { LatLng, RideFareEstimateType, RideSummary, RideType } from '../../types/passenger';

type PassengerBottomSheetProps = {
  rideSummary: RideSummary;
  rideType: RideType;
  rideFareEstimate?: RideFareEstimateType | null;
  isLoadingRideFareEstimate?: boolean;
  pickupCoords?: LatLng | null;
  destinationCoords?: LatLng | null;
  onBack: () => void;
  onOrderNow: () => void;
  isSubmitting?: boolean;
};

export default function PassengerBottomSheet({
  rideSummary,
  rideType,
  rideFareEstimate,
  isLoadingRideFareEstimate = false,
  pickupCoords,
  destinationCoords,
  onBack,
  onOrderNow,
  isSubmitting = false,
}: PassengerBottomSheetProps) {
  const formatAmount = (amount?: number | null, currencyCode?: string | null) => {
    if (amount == null || !Number.isFinite(amount)) return 'Preparing...';
    const normalizedCurrency = (currencyCode || 'ILS').toUpperCase();
    if (normalizedCurrency === 'ILS') {
      return `${String.fromCharCode(0x20aa)}${amount.toFixed(2)}`;
    }
    return `${normalizedCurrency} ${amount.toFixed(2)}`;
  };

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
        <View style={styles.bottomSheetHeader}>
          <TouchableOpacity style={styles.bottomSheetBackAction} onPress={onBack}>
            <MaterialCommunityIcons name="arrow-left" size={18} color="#111827" />
            <Text style={styles.bottomSheetBackActionText}>Edit ride</Text>
          </TouchableOpacity>

          <View style={styles.bottomSheetTitleWrap}>
            <Text style={styles.bottomTitle}>Confirm Your Ride</Text>
            <Text style={styles.bottomSheetSubtitle}>
              A last quick look before we send your request.
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.bottomSheetScroll}
          contentContainerStyle={styles.bottomSheetContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.bottomSummaryBanner}>
            <Text style={styles.bottomSummaryTitle}>Route ready</Text>
            <Text style={styles.bottomSummaryText}>
              You can still go back and change the trip before ordering.
            </Text>
          </View>

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

            {rideType === 'Scheduled' && (
              <View style={styles.bottomSheetRow}>
                <Text style={styles.bottomLabel}>Scheduled</Text>
                <Text style={styles.bottomValue}>{rideSummary.scheduledTime}</Text>
              </View>
            )}
          </View>

          <View style={styles.bottomFareCard}>
            <View style={styles.bottomFareHeader}>
              <View style={styles.bottomFareIconWrap}>
                <MaterialCommunityIcons name="cash-fast" size={18} color="#111827" />
              </View>
              <View style={styles.bottomFareTextWrap}>
                <Text style={styles.bottomFareTitle}>Estimated fare</Text>
                <Text style={styles.bottomFareSubtitle}>
                  {isLoadingRideFareEstimate
                    ? 'Calculating the route price...'
                    : 'This is an approximate fare before your ride is requested.'}
                </Text>
              </View>
            </View>

            <View style={styles.bottomFareStatsRow}>
              <View style={styles.bottomFareStatCard}>
                <Text style={styles.bottomFareStatLabel}>Distance</Text>
                <Text style={styles.bottomFareStatValue}>
                  {rideFareEstimate?.distanceKm != null
                    ? `${rideFareEstimate.distanceKm.toFixed(2)} km`
                    : '--'}
                </Text>
              </View>
              <View style={styles.bottomFareStatCard}>
                <Text style={styles.bottomFareStatLabel}>Duration</Text>
                <Text style={styles.bottomFareStatValue}>
                  {rideFareEstimate?.durationMinutes != null
                    ? `${rideFareEstimate.durationMinutes} min`
                    : '--'}
                </Text>
              </View>
            </View>

            <View style={styles.bottomFareTotalRow}>
              <Text style={styles.bottomFareTotalLabel}>Approximate total</Text>
              <Text style={styles.bottomFareTotalValue}>
                {formatAmount(rideFareEstimate?.amount, rideFareEstimate?.currencyCode)}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomFooter}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                styles.bottomPrimaryAction,
                isSubmitting && styles.primaryButtonDisabled,
              ]}
            onPress={onOrderNow}
            disabled={isSubmitting}
            >
              <Text style={styles.primaryButtonText}>
              {isSubmitting ? 'Sending request...' : 'Order Taxi'}
              </Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
