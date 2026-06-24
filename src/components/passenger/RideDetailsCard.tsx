import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useEffect, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
        <View style={styles.bookingHeroRow}>
          <View style={styles.bookingHeroTextWrap}>
            <Text style={styles.bookingHeroTitle}>Where to?</Text>
            <Text style={styles.bookingHeroSubtitle}>
              Set your route and a few ride details. We will keep everything else simple.
            </Text>
          </View>
          <View style={styles.bookingHeroBadge}>
            <MaterialCommunityIcons name="map-marker-distance" size={18} color="#111827" />
          </View>
        </View>

        <View style={styles.routeBuilderCard}>
          <View style={styles.routeInputRow}>
            <View style={[styles.routeIconDot, styles.routeIconDotPickup]} />
            <View style={styles.routeInputTextWrap}>
              <Text style={styles.routeInputLabel}>Pickup</Text>
              <TextInput
                placeholder="Where should we pick you up?"
                placeholderTextColor="#9ca3af"
                value={pickupLocation}
                onChangeText={setPickupLocation}
                style={styles.routeInput}
              />
            </View>
          </View>

          <View style={styles.routeInputDivider} />

          <View style={styles.routeInputRow}>
            <View style={[styles.routeIconDot, styles.routeIconDotDestination]} />
            <View style={styles.routeInputTextWrap}>
              <Text style={styles.routeInputLabel}>Destination</Text>
              <TextInput
                placeholder="Where are you going?"
                placeholderTextColor="#9ca3af"
                value={destination}
                onChangeText={setDestination}
                style={styles.routeInput}
              />
            </View>
          </View>
        </View>

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

        <Text style={styles.sectionLabel}>Ride timing</Text>
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
            <Text
              style={[
                styles.segmentButtonHint,
                rideType === 'Immediate' && styles.segmentButtonHintActive,
              ]}
            >
              Book now
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
            <Text
              style={[
                styles.segmentButtonHint,
                rideType === 'Scheduled' && styles.segmentButtonHintActive,
              ]}
            >
              Choose later
            </Text>
          </TouchableOpacity>
        </View>

        {rideType === 'Scheduled' && (
          <TouchableOpacity
            style={styles.schedulePreviewCard}
            onPress={() => setIsScheduleModalVisible(true)}
          >
            <Text style={styles.schedulePreviewLabel}>Scheduled time</Text>
            <Text style={styles.schedulePreviewValue}>
              {scheduledTime || 'Choose date and time'}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.tripOptionsCard}>
          <Text style={styles.sectionLabel}>Trip setup</Text>

          <View style={styles.quickOptionGrid}>
            <View style={styles.quickOptionTile}>
              <Text style={styles.quickOptionLabel}>Passengers</Text>
              <TextInput
                value={passengerCount}
                onChangeText={setPassengerCount}
                style={styles.quickOptionInput}
                keyboardType="numeric"
                placeholder="1"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.quickOptionTile}>
              <Text style={styles.quickOptionLabel}>Bags</Text>
              <TextInput
                value={luggageCount}
                onChangeText={setLuggageCount}
                style={styles.quickOptionInput}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

        </View>

        <View style={styles.orderButtonWrap}>
          <TouchableOpacity style={styles.primaryButton} onPress={onReviewRide}>
            <Text style={styles.primaryButtonText}>Review Ride</Text>
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
          <KeyboardAvoidingView
            style={styles.modalKeyboardWrap}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}
          >
            <ScrollView
              contentContainerStyle={styles.modalScrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>Schedule your ride</Text>
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

                  <TouchableOpacity style={styles.primaryButton} onPress={handleSaveScheduledTime}>
                    <Text style={styles.primaryButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
}
