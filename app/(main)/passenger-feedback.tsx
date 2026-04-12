import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import AppNavbar from '../../src/components/AppNavbar';
import FeedbackCard from '../../src/components/passenger/FeedbackCard';
import { usePassengerScreen } from '../../src/hooks/usePassengerScreen';
import { passengerStyles as styles } from '../../src/styles/passengerStyles';

export default function PassengerFeedbackScreen() {
  const router = useRouter();
  const {
    user,
    loadingUser,
    notLoggedIn,
    pendingFeedbackRide,
    rating,
    wasDriverPolite,
    wasDriverOnTime,
    wasVehicleClean,
    luggageHandlingRating,
    comment,
    isSubmittingFeedback,
    setRating,
    setWasDriverPolite,
    setWasDriverOnTime,
    setWasVehicleClean,
    setLuggageHandlingRating,
    setComment,
    handleSubmitFeedback,
  } = usePassengerScreen();

  if (notLoggedIn) {
    return <Redirect href="/(auth)" />;
  }

  if (loadingUser) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading feedback...</Text>
      </View>
    );
  }

  const handleSubmitAndReturn = async () => {
    const submitted = await handleSubmitFeedback();
    if (submitted) {
      router.replace('/(main)/passenger');
    }
  };

  return (
    <View style={styles.screen}>
      <AppNavbar
        fullName={user?.fullName}
        profileRoute="/(main)/passenger-profile"
        coinBalance={undefined}
        profileImageStorageKey={
          user?.passengerId ? `passenger_profile_image_url_${user.passengerId}` : undefined
        }
      />

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace('/(main)/passenger')}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="arrow-left" size={18} color="#111827" />
          <Text style={styles.backButtonText}>Back to Passenger Home</Text>
        </TouchableOpacity>

        <View style={styles.feedbackHeroCard}>
          <View style={styles.feedbackHeroIconWrap}>
            <MaterialCommunityIcons name="star-circle-outline" size={28} color="#ca8a04" />
          </View>
          <Text style={styles.feedbackHeroTitle}>Ride Finished</Text>
          <Text style={styles.feedbackHeroSubtitle}>
            Share your experience now and receive coins after submitting your feedback.
          </Text>
        </View>

        {pendingFeedbackRide ? (
          <FeedbackCard
            pendingFeedbackRide={pendingFeedbackRide}
            rating={rating}
            setRating={setRating}
            wasDriverPolite={wasDriverPolite}
            setWasDriverPolite={setWasDriverPolite}
            wasDriverOnTime={wasDriverOnTime}
            setWasDriverOnTime={setWasDriverOnTime}
            wasVehicleClean={wasVehicleClean}
            setWasVehicleClean={setWasVehicleClean}
            luggageHandlingRating={luggageHandlingRating}
            setLuggageHandlingRating={setLuggageHandlingRating}
            comment={comment}
            setComment={setComment}
            onSubmitFeedback={handleSubmitAndReturn}
            isSubmitting={isSubmittingFeedback}
          />
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>No feedback pending</Text>
            <Text style={styles.helperText}>
              There is no completed ride waiting for feedback right now.
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.replace('/(main)/passenger')}
            >
              <Text style={styles.primaryButtonText}>Return Home</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
