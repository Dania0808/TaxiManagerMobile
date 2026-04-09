import {
    ActivityIndicator,
    Modal,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useEffect, useState } from 'react';
import { passengerStyles as styles } from '../../styles/passengerStyles';
import { PlaceSuggestion, RideType } from '../../types/passenger';

type RideDetailsCardProps = {
  pickupLocation: string;
  setPickupLocation: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;

  pickupSuggestions: PlaceSuggestion[];
  destinationSuggestions: PlaceSuggestion[];
  pickupLoading: boolean;
  destinationLoading: boolean;

  onSelectPickupSuggestion: (item: PlaceSuggestion) => void;
  onSelectDestinationSuggestion: (item: PlaceSuggestion) => void;

  passengerCount: string;
  setPassengerCount: (value: string) => void;
  luggageCount: string;
  setLuggageCount: (value: string) => void;
  rideType: RideType;
  setRideType: (value: RideType) => void;
  scheduledTime: string;
  setScheduledTime: (value: string) => void;
  isShared: boolean;
  setIsShared: (value: boolean) => void;

  onReviewRide: () => void;
};

export default function RideDetailsCard({
  pickupLocation,
  setPickupLocation,
  destination,
  setDestination,
  pickupSuggestions,
  destinationSuggestions,
  pickupLoading,
  destinationLoading,
  onSelectPickupSuggestion,
  onSelectDestinationSuggestion,
  passengerCount,
  setPassengerCount,
  luggageCount,
  setLuggageCount,
  rideType,
  setRideType,
  scheduledTime,
  setScheduledTime,
  isShared,
  setIsShared,
  onReviewRide,
}: RideDetailsCardProps) {
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledClock, setScheduledClock] = useState('');

  useEffect(() => {
    if (scheduledTime.includes(' ')) {
      const [datePart, timePart] = scheduledTime.split(' ');
      setScheduledDate(datePart || '');
      setScheduledClock(timePart || '');
    } else if (!scheduledTime) {
      setScheduledDate('');
      setScheduledClock('');
    }
  }, [scheduledTime]);

  const handleChooseImmediate = () => {
    setRideType('Immediate');
    setScheduledTime('');
    setIsScheduleModalVisible(false);
  };

  const handleChooseScheduled = () => {
    setRideType('Scheduled');
    setIsScheduleModalVisible(true);
  };

  const handleSaveScheduledTime = () => {
    const combined = `${scheduledDate.trim()} ${scheduledClock.trim()}`.trim();
    setScheduledTime(combined);
    setIsScheduleModalVisible(false);
  };

  return (
    <>
      <View style={styles.formCard}>
        <Text style={styles.fieldLabel}>Pickup</Text>
        <TextInput
          placeholder="Enter pickup location"
          placeholderTextColor="#9ca3af"
          value={pickupLocation}
          onChangeText={setPickupLocation}
          style={styles.input}
        />

        {pickupLoading ? <ActivityIndicator style={styles.searchLoader} /> : null}

        {pickupSuggestions.length > 0 && (
          <View style={styles.suggestionsBox}>
            {pickupSuggestions.map((item) => (
              <TouchableOpacity
                key={item.placeId}
                style={styles.suggestionItem}
                onPress={() => onSelectPickupSuggestion(item)}
              >
                <Text style={styles.suggestionTitle}>{item.primaryText}</Text>
                {!!item.secondaryText && (
                  <Text style={styles.suggestionSubtitle}>{item.secondaryText}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.fieldLabel}>Destination</Text>
        <TextInput
          placeholder="Enter destination"
          placeholderTextColor="#9ca3af"
          value={destination}
          onChangeText={setDestination}
          style={styles.input}
        />

        {destinationLoading ? <ActivityIndicator style={styles.searchLoader} /> : null}

        {destinationSuggestions.length > 0 && (
          <View style={styles.suggestionsBox}>
            {destinationSuggestions.map((item) => (
              <TouchableOpacity
                key={item.placeId}
                style={styles.suggestionItem}
                onPress={() => onSelectDestinationSuggestion(item)}
              >
                <Text style={styles.suggestionTitle}>{item.primaryText}</Text>
                {!!item.secondaryText && (
                  <Text style={styles.suggestionSubtitle}>{item.secondaryText}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.inlineInputs}>
          <View style={styles.inlineInputBox}>
            <Text style={styles.inputLabel}>Passengers</Text>
            <TextInput
              value={passengerCount}
              onChangeText={setPassengerCount}
              style={styles.input}
              keyboardType="numeric"
              placeholder="1"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inlineInputBox}>
            <Text style={styles.inputLabel}>Travel Bags</Text>
            <TextInput
              value={luggageCount}
              onChangeText={setLuggageCount}
              style={styles.input}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>Ride Type</Text>

        <View style={styles.rideTypeButtons}>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              rideType === 'Immediate' && styles.segmentButtonActive,
            ]}
            onPress={handleChooseImmediate}
          >
            <Text
              style={[
                styles.segmentButtonText,
                rideType === 'Immediate' && styles.segmentButtonTextActive,
              ]}
            >
              Immediate
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentButton,
              rideType === 'Scheduled' && styles.segmentButtonActive,
            ]}
            onPress={handleChooseScheduled}
          >
            <Text
              style={[
                styles.segmentButtonText,
                rideType === 'Scheduled' && styles.segmentButtonTextActive,
              ]}
            >
              Scheduled
            </Text>
          </TouchableOpacity>
        </View>

        {rideType === 'Scheduled' && (
          <TouchableOpacity
            style={styles.schedulePreviewCard}
            onPress={() => setIsScheduleModalVisible(true)}
          >
            <Text style={styles.schedulePreviewLabel}>Scheduled Time</Text>
            <Text style={styles.schedulePreviewValue}>
              {scheduledTime || 'Choose date and time'}
            </Text>
          </TouchableOpacity>
        )}

        {rideType === 'Immediate' && (
          <View style={styles.sharedRow}>
            <View style={styles.sharedTextWrap}>
              <Text style={styles.sectionLabel}>Shared Ride</Text>
              <Text style={styles.helperText}>
                Enable this if you want a shared ride option.
              </Text>
            </View>
            <Switch value={isShared} onValueChange={setIsShared} />
          </View>
        )}

        {rideType === 'Immediate' && isShared && (
          <View style={styles.sharedInfoBox}>
            <Text style={styles.sharedInfoTitle}>Shared Ride Enabled</Text>
            <Text style={styles.helperText}>
              Matching shared rides will appear here after we connect the shared-ride backend.
            </Text>
          </View>
        )}

        <View style={styles.orderButtonWrap}>
          <TouchableOpacity style={styles.primaryButton} onPress={onReviewRide}>
            <Text style={styles.primaryButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={isScheduleModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsScheduleModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Schedule Your Ride</Text>
            <Text style={styles.modalSubtitle}>
              Choose the date and time for your pickup.
            </Text>

            <Text style={styles.fieldLabel}>Date</Text>
            <TextInput
              value={scheduledDate}
              onChangeText={setScheduledDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />

            <Text style={styles.fieldLabel}>Time</Text>
            <TextInput
              value={scheduledClock}
              onChangeText={setScheduledClock}
              placeholder="HH:MM"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setIsScheduleModalVisible(false)}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleSaveScheduledTime}
              >
                <Text style={styles.primaryButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
