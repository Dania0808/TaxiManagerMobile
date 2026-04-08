import { Text, TouchableOpacity, View } from 'react-native';
import { passengerStyles as styles } from '../../styles/passengerStyles';
import { RideSummary } from '../../types/passenger';

type OrderPlacedCardProps = {
  rideSummary: RideSummary;
  rideId?: number;
  status?: string;
  onTrackRide: () => void;
  onClose: () => void;
};

export default function OrderPlacedCard({
  rideSummary,
  rideId,
  status,
  onTrackRide,
  onClose,
}: OrderPlacedCardProps) {
  return (
    <View style={styles.orderPlacedCard}>
      <View style={styles.orderPlacedIconWrap}>
        <Text style={styles.orderPlacedIcon}>OK</Text>
      </View>

      <Text style={styles.orderPlacedTitle}>Order Placed</Text>
      <Text style={styles.orderPlacedSubtitle}>
        Your ride request was sent successfully. We are matching you with a
        nearby driver now.
      </Text>

      <View style={styles.orderPlacedBanner}>
        <Text style={styles.orderPlacedBannerTitle}>
          {status === 'Pending'
            ? 'Waiting for driver confirmation'
            : 'Ride request created successfully'}
        </Text>
        <Text style={styles.helperText}>
          {rideId ? `Ride #${rideId}` : 'Your ride details are saved below.'}
        </Text>
      </View>

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

        {rideSummary.rideType === 'Immediate' ? (
          <View style={styles.bottomSheetRow}>
            <Text style={styles.bottomLabel}>Shared Ride</Text>
            <Text style={styles.bottomValue}>{rideSummary.shared}</Text>
          </View>
        ) : (
          <View style={styles.bottomSheetRow}>
            <Text style={styles.bottomLabel}>Scheduled</Text>
            <Text style={styles.bottomValue}>{rideSummary.scheduledTime}</Text>
          </View>
        )}
      </View>

      <View style={styles.orderPlacedActions}>
        <TouchableOpacity style={styles.primaryButton} onPress={onTrackRide}>
          <Text style={styles.primaryButtonText}>Track My Ride</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onClose}
        >
          <Text style={styles.secondaryButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
