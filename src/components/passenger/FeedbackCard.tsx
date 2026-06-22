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
  onSkipFeedback?: () => void;
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
  onSkipFeedback,
  isSubmitting = false,
}: FeedbackCardProps) {
  if (!pendingFeedbackRide) return null;

  const ratingOptions = ['1', '2', '3', '4', '5'];
  const luggageOptions = ['1', '2', '3', '4', '5'];

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Rate This Ride</Text>
      <Text style={styles.helperText}>
        Feedback is optional. Share a quick rating now, or skip and come back later.
      </Text>

      <View style={styles.feedbackTripSummary}>
        <Text style={styles.feedbackTripRowLabel}>Ride #{pendingFeedbackRide.id}</Text>
        <Text style={styles.feedbackTripRowValue}>
          {pendingFeedbackRide.pickupLocation || 'Unknown pickup'}
        </Text>
        <Text style={styles.feedbackTripRowArrow}>to</Text>
        <Text style={styles.feedbackTripRowValue}>
          {pendingFeedbackRide.destination || 'Unknown destination'}
        </Text>
      </View>

      <Text style={styles.feedbackSectionTitle}>Overall Rating</Text>
      <View style={styles.feedbackChoiceRow}>
        {ratingOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.feedbackChip,
              rating === option && styles.feedbackChipActive,
            ]}
            onPress={() => setRating(option)}
          >
            <Text
              style={[
                styles.feedbackChipText,
                rating === option && styles.feedbackChipTextActive,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.feedbackSwitchLabel}>Driver was polite</Text>
        <Switch value={wasDriverPolite} onValueChange={setWasDriverPolite} />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.feedbackSwitchLabel}>Driver was on time</Text>
        <Switch value={wasDriverOnTime} onValueChange={setWasDriverOnTime} />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.feedbackSwitchLabel}>Vehicle was clean</Text>
        <Switch value={wasVehicleClean} onValueChange={setWasVehicleClean} />
      </View>

      <Text style={styles.feedbackSectionTitle}>Luggage Handling</Text>
      <Text style={styles.helperText}>Optional, only if luggage handling mattered on this trip.</Text>
      <View style={styles.feedbackChoiceRow}>
        {luggageOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.feedbackChip,
              luggageHandlingRating === option && styles.feedbackChipActive,
            ]}
            onPress={() => setLuggageHandlingRating(option)}
          >
            <Text
              style={[
                styles.feedbackChipText,
                luggageHandlingRating === option && styles.feedbackChipTextActive,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        placeholder="Add a short comment"
        value={comment}
        onChangeText={setComment}
        style={[styles.input, styles.feedbackCommentInput]}
        multiline
      />

      <View style={styles.orderButtonWrap}>
        {onSkipFeedback ? (
          <TouchableOpacity style={styles.secondaryButton} onPress={onSkipFeedback}>
            <Text style={styles.secondaryButtonText}>Skip for Now</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          style={[
            styles.primaryButton,
            isSubmitting && styles.primaryButtonDisabled,
          ]}
          onPress={onSubmitFeedback}
          disabled={isSubmitting}
        >
          <Text style={styles.primaryButtonText}>
            {isSubmitting ? 'Sending feedback...' : 'Submit Feedback'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
