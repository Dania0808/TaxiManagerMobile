import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import AppNavbar from '../../src/components/AppNavbar';
import FeedbackCard from '../../src/components/passenger/FeedbackCard';
import { usePassengerScreen } from '../../src/hooks/usePassengerScreen';
import { getRidePaymentStatus, skipPassengerRideFeedback } from '../../src/services/passengerService';
import { passengerStyles as styles } from '../../src/styles/passengerStyles';
import { RidePaymentStatusType } from '../../src/types/passenger';

export default function PassengerFeedbackScreen() {
  const router = useRouter();
  const { notificationRefreshAt, rideId: rideIdParam } = useLocalSearchParams<{
    notificationRefreshAt?: string;
    rideId?: string;
  }>();
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
    handleGetPendingFeedbackRide,
  } = usePassengerScreen();
  const [paymentStatus, setPaymentStatus] = useState<RidePaymentStatusType | null>(null);
  const [loadingPayment, setLoadingPayment] = useState(true);

  useEffect(() => {
    if (!notificationRefreshAt) return;

    handleGetPendingFeedbackRide();
  }, [notificationRefreshAt, handleGetPendingFeedbackRide]);

  useEffect(() => {
    const loadPayment = async () => {
      const passengerId = user?.passengerId;
      const rideId =
        (rideIdParam && !Number.isNaN(Number(rideIdParam)) ? Number(rideIdParam) : undefined) ??
        pendingFeedbackRide?.id;

      if (!passengerId || !rideId) {
        setLoadingPayment(false);
        return;
      }

      try {
        setLoadingPayment(true);
        const data = await getRidePaymentStatus(rideId, passengerId);
        setPaymentStatus(data);
      } catch {
        setPaymentStatus(null);
      } finally {
        setLoadingPayment(false);
      }
    };

    loadPayment();
  }, [user?.passengerId, pendingFeedbackRide?.id, rideIdParam]);

  if (notLoggedIn) {
    return <Redirect href="/(auth)" />;
  }

  if (loadingUser || loadingPayment) {
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
  const handleSkipForNow = () => {
    const rideId =
      (rideIdParam && !Number.isNaN(Number(rideIdParam)) ? Number(rideIdParam) : undefined) ??
      pendingFeedbackRide?.id;
    const passengerId = user?.passengerId;

    if (!rideId || !passengerId) {
      router.replace('/(main)/passenger');
      return;
    }

    skipPassengerRideFeedback({ rideId, passengerId })
      .catch(() => null)
      .finally(() => {
        router.replace('/(main)/passenger');
      });
  };
  const isPaymentComplete = paymentStatus?.status?.toLowerCase() === 'paid';

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
          <Text style={styles.feedbackHeroTitle}>Rate the Ride</Text>
          <Text style={styles.feedbackHeroSubtitle}>
            Payment is done. Feedback is optional, and you can skip it for now if you want.
          </Text>
        </View>

        {!isPaymentComplete && pendingFeedbackRide ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Payment required first</Text>
            <Text style={styles.helperText}>
              Complete the ride payment before feedback becomes available.
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() =>
                router.replace({
                  pathname: '/(main)/passenger-payment',
                  params: { rideId: String(pendingFeedbackRide.id) },
                })
              }
            >
              <Text style={styles.primaryButtonText}>Go to Payment</Text>
            </TouchableOpacity>
          </View>
        ) : pendingFeedbackRide ? (
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
            onSkipFeedback={handleSkipForNow}
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
