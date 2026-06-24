import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { passengerStyles as styles } from '../../styles/passengerStyles';
import { RideSummary } from '../../types/passenger';
import PassengerRideProgress from './PassengerRideProgress';

type OrderPlacedCardProps = {
  rideSummary: RideSummary;
  rideId?: number;
  status?: string;
  onTrackRide?: () => void;
  onRefreshRideStatus?: () => void;
  onCancelRide?: () => void;
  isCancelling?: boolean;
};

export default function OrderPlacedCard({
  rideSummary,
  rideId,
  status,
  onTrackRide,
  onRefreshRideStatus,
  onCancelRide,
  isCancelling = false,
}: OrderPlacedCardProps) {
  const isPending = status === 'Pending';
  const statusTitle = isPending
    ? 'Finding the best nearby driver'
    : status === 'Accepted'
      ? 'A driver is reviewing your ride'
      : 'Ride request created successfully';
  const statusSubtitle = isPending
    ? 'Stay on this screen while we keep checking nearby driver availability and dispatch updates.'
    : status === 'Accepted'
      ? 'Your request is moving forward. Open tracking to watch the live trip state.'
      : 'Your ride details are locked in and ready for the next dispatch update.';
  const canOpenTracking = !!onTrackRide && status !== 'Pending';

  return (
    <View style={styles.orderPlacedCard}>
      <View style={styles.orderPlacedIconWrap}>
        <MaterialCommunityIcons name="check-circle-outline" size={30} color="#166534" />
      </View>

      <Text style={styles.orderPlacedTitle}>Ride Request Sent</Text>
      <Text style={styles.orderPlacedSubtitle}>
        Your trip is in the dispatch queue now. We will keep this screen updated as the ride moves from matching to driver assignment.
      </Text>

      <View style={styles.orderPlacedBanner}>
        <Text style={styles.orderPlacedBannerTitle}>{statusTitle}</Text>
        <Text style={styles.orderPlacedBannerText}>{statusSubtitle}</Text>
        <Text style={styles.helperText}>
          {rideId
            ? `Ride #${rideId}. You can refresh the match state at any time or open tracking when a driver is assigned.`
            : 'Your ride details are saved below.'}
        </Text>
      </View>

      <PassengerRideProgress status={status} />

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

        {rideSummary.rideType !== 'Immediate' ? (
          <View style={styles.bottomSheetRow}>
            <Text style={styles.bottomLabel}>Scheduled</Text>
            <Text style={styles.bottomValue}>{rideSummary.scheduledTime}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.orderPlacedActions}>
        {onRefreshRideStatus ? (
          <TouchableOpacity style={styles.secondaryButton} onPress={onRefreshRideStatus}>
            <Text style={styles.secondaryButtonText}>Refresh Match Status</Text>
          </TouchableOpacity>
        ) : null}

        {onCancelRide ? (
          <TouchableOpacity
            style={styles.cancelRideGhostButton}
            onPress={onCancelRide}
            disabled={isCancelling}
          >
            <Text style={styles.cancelRideGhostButtonText}>
              {isCancelling ? 'Cancelling ride...' : 'Cancel ride'}
            </Text>
          </TouchableOpacity>
        ) : null}

        {canOpenTracking ? (
          <TouchableOpacity style={styles.primaryButton} onPress={onTrackRide}>
            <Text style={styles.primaryButtonText}>Open Ride Tracking</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.pendingTrackingHint}>
            <MaterialCommunityIcons name="radar" size={16} color="#1f2937" />
            <Text style={styles.pendingTrackingHintText}>
              Live tracking will unlock as soon as a driver is assigned.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
