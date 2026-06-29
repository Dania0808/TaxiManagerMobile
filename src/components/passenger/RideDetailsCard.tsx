import {
  ActivityIndicator,
  Alert,
  Modal,
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

function parseScheduledDate(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::\d{2})?$/);
  if (!match) return null;

  const [, yearText, monthText, dayText, hourText, minuteText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const parsed = new Date(year, month - 1, day, hour, minute, 0, 0);

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day ||
    parsed.getHours() !== hour ||
    parsed.getMinutes() !== minute
  ) {
    return null;
  }

  return parsed;
}

function roundUpToNextQuarterHour(date: Date) {
  const next = new Date(date);
  next.setSeconds(0, 0);
  const minutes = next.getMinutes();
  const remainder = minutes % 15;
  if (remainder !== 0) {
    next.setMinutes(minutes + (15 - remainder));
  }
  if (next <= date) {
    next.setMinutes(next.getMinutes() + 15);
  }
  return next;
}

function formatDateForApi(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:00`;
}

function formatDatePreview(date: Date) {
  return date.toLocaleString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDateInput(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

function formatTimeInput(date: Date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function normalizeDateInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 6);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 6)}`;
}

function normalizeTimeInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
}

function buildScheduledDateFromInputs(dateInput: string, timeInput: string) {
  const dateMatch = dateInput.match(/^(\d{2})\/(\d{2})\/(\d{2})$/);
  const timeMatch = timeInput.match(/^(\d{2}):(\d{2})$/);
  if (!dateMatch || !timeMatch) return null;

  const day = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const year = 2000 + Number(dateMatch[3]);
  const hours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2]);

  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  const parsed = new Date(year, month - 1, day, hours, minutes, 0, 0);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
}

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
  const [selectedScheduleDate, setSelectedScheduleDate] = useState<Date>(
    roundUpToNextQuarterHour(new Date(Date.now() + 15 * 60 * 1000))
  );
  const [scheduleDateInput, setScheduleDateInput] = useState(
    formatDateInput(roundUpToNextQuarterHour(new Date(Date.now() + 15 * 60 * 1000)))
  );
  const [scheduleTimeInput, setScheduleTimeInput] = useState(
    formatTimeInput(roundUpToNextQuarterHour(new Date(Date.now() + 15 * 60 * 1000)))
  );

  const formatScheduledPreview = (value: string) => {
    const parsed = parseScheduledDate(value);
    if (!parsed) return 'Choose date and time';
    return formatDatePreview(parsed);
  };

  useEffect(() => {
    const parsed = parseScheduledDate(scheduledTime);

    if (parsed) {
      setSelectedScheduleDate(parsed);
      setScheduleDateInput(formatDateInput(parsed));
      setScheduleTimeInput(formatTimeInput(parsed));
    } else if (!scheduledTime) {
      const next = roundUpToNextQuarterHour(new Date(Date.now() + 15 * 60 * 1000));
      setSelectedScheduleDate(next);
      setScheduleDateInput(formatDateInput(next));
      setScheduleTimeInput(formatTimeInput(next));
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
    const parsed = buildScheduledDateFromInputs(scheduleDateInput, scheduleTimeInput);
    if (!parsed) {
      Alert.alert('Invalid schedule', 'Enter the date as DD/MM/YY and the time as 00:00.');
      return;
    }

    if (parsed.getTime() <= Date.now()) {
      Alert.alert('Invalid schedule', 'Scheduled time must be later than now.');
      return;
    }

    setSelectedScheduleDate(parsed);
    setScheduledTime(formatDateForApi(parsed));
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
              {formatScheduledPreview(scheduledTime)}
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
        onRequestClose={() => {
          setIsScheduleModalVisible(false);
        }}
      >
        <View style={styles.modalBackdrop}>
          <ScrollView contentContainerStyle={styles.modalScrollContent}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Schedule your ride</Text>
              <Text style={styles.modalSubtitle}>
                Pick a date and a pickup time. The driver will only see this ride when that time arrives.
              </Text>

              <View style={styles.schedulePreviewCard}>
                <Text style={styles.schedulePreviewLabel}>Pickup moment</Text>
                <Text style={styles.schedulePreviewValue}>
                  {formatDatePreview(selectedScheduleDate)}
                </Text>
              </View>

              <Text style={styles.fieldLabel}>Date</Text>
              <TextInput
                value={scheduleDateInput}
                onChangeText={(value) => setScheduleDateInput(normalizeDateInput(value))}
                placeholder="DD/MM/YY"
                placeholderTextColor="#9ca3af"
                keyboardType="number-pad"
                style={styles.input}
                maxLength={8}
              />

              <Text style={styles.fieldLabel}>Time</Text>
              <TextInput
                value={scheduleTimeInput}
                onChangeText={(value) => setScheduleTimeInput(normalizeTimeInput(value))}
                placeholder="00:00"
                placeholderTextColor="#9ca3af"
                keyboardType="number-pad"
                style={styles.input}
                maxLength={5}
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
        </View>
      </Modal>
    </>
  );
}
