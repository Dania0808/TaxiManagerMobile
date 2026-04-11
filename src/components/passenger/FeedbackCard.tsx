import { Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { passengerStyles as styles } from '../../styles/passengerStyles';
import { PendingFeedbackRideType } from '../../types/passenger';

type FeedbackCardProps = {
  pendingFeedbackRide: PendingFeedbackRideType | null;
  rating: string;
  setRating: (value: string) => void;
  wasDriverPolite: boolean;
  setWasDriverPolite: (value: boolean) => void;
  wasDriverOnTime: boolean;
  setWasDriverOnTime: (value: boolean) => void;
  wasVehicleClean: boolean;
  setWasVehicleClean: (value: boolean) => void;
  luggageHandlingRating: string;
  setLuggageHandlingRating: (value: string) => void;
  comment: string;
  setComment: (value: string) => void;
  onSubmitFeedback: () => void;
  isSubmitting?: boolean;
};

export default function FeedbackCard({
  pendingFeedbackRide,
  rating,
  setRating,
  wasDriverPolite,
  setWasDriverPolite,
  wasDriverOnTime,
  setWasDriverOnTime,
  wasVehicleClean,
  setWasVehicleClean,
  luggageHandlingRating,
  setLuggageHandlingRating,
  comment,
  setComment,
  onSubmitFeedback,
  isSubmitting = false,
}: FeedbackCardProps) {
  if (!pendingFeedbackRide) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Give Feedback & Earn Coins</Text>
      <Text style={styles.helperText}>
        Help us improve and receive coins that count like shekels in future pricing.
      </Text>

      <Text>
        <Text style={styles.bold}>Ride Id:</Text> {pendingFeedbackRide.id}
      </Text>
      <Text>
        <Text style={styles.bold}>Pickup:</Text> {pendingFeedbackRide.pickupLocation}
      </Text>
      <Text>
        <Text style={styles.bold}>Destination:</Text> {pendingFeedbackRide.destination}
      </Text>

      <TextInput
        placeholder="Rating (1-5)"
        value={rating}
        onChangeText={setRating}
        style={styles.input}
        keyboardType="numeric"
      />

      <View style={styles.switchRow}>
        <Text>Driver was polite</Text>
        <Switch value={wasDriverPolite} onValueChange={setWasDriverPolite} />
      </View>

      <View style={styles.switchRow}>
        <Text>Driver was on time</Text>
        <Switch value={wasDriverOnTime} onValueChange={setWasDriverOnTime} />
      </View>

      <View style={styles.switchRow}>
        <Text>Vehicle was clean</Text>
        <Switch value={wasVehicleClean} onValueChange={setWasVehicleClean} />
      </View>

      <TextInput
        placeholder="Luggage Handling Rating (optional)"
        value={luggageHandlingRating}
        onChangeText={setLuggageHandlingRating}
        style={styles.input}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Comment"
        value={comment}
        onChangeText={setComment}
        style={styles.input}
        multiline
      />

      <View style={styles.orderButtonWrap}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            isSubmitting && styles.primaryButtonDisabled,
          ]}
          onPress={onSubmitFeedback}
          disabled={isSubmitting}
        >
          <Text style={styles.primaryButtonText}>
            {isSubmitting
              ? 'Sending feedback...'
              : 'Submit Feedback and Earn Coins'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
