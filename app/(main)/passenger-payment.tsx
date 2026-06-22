import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';

import AppNavbar from '../../src/components/AppNavbar';
import { usePassengerScreen } from '../../src/hooks/usePassengerScreen';
import {
  captureRidePaymentOrder,
  createRidePaymentOrder,
  getRidePaymentStatus,
} from '../../src/services/passengerService';
import { passengerStyles as styles } from '../../src/styles/passengerStyles';
import { RidePaymentStatusType } from '../../src/types/passenger';

function formatCurrencyAmount(
  amount: number | null | undefined,
  currencyCode?: string | null
) {
  if (amount == null || !Number.isFinite(amount)) return 'Unavailable';

  const normalizedCurrency = (currencyCode || 'ILS').toUpperCase();
  if (normalizedCurrency === 'ILS') {
    return `${String.fromCharCode(0x20aa)}${amount.toFixed(2)}`;
  }
  if (normalizedCurrency === 'ILS') {
    return `₪${amount.toFixed(2)}`;
  }

  return `${normalizedCurrency} ${amount.toFixed(2)}`;
}

export default function PassengerPaymentScreen() {
  const router = useRouter();
  const { rideId: rideIdParam, notificationRefreshAt } = useLocalSearchParams<{
    rideId?: string;
    notificationRefreshAt?: string;
  }>();
  const {
    user,
    loadingUser,
    notLoggedIn,
    pendingFeedbackRide,
    handleGetPendingFeedbackRide,
  } = usePassengerScreen();
  const [paymentStatus, setPaymentStatus] = useState<RidePaymentStatusType | null>(null);
  const [loadingPayment, setLoadingPayment] = useState(true);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isCapturingOrder, setIsCapturingOrder] = useState(false);
  const [localPayPalOrderId, setLocalPayPalOrderId] = useState('');

  const passengerId = user?.passengerId ?? null;
  const rideId = useMemo(() => {
    if (rideIdParam && !Number.isNaN(Number(rideIdParam))) {
      return Number(rideIdParam);
    }

    return pendingFeedbackRide?.id ?? null;
  }, [pendingFeedbackRide?.id, rideIdParam]);

  const loadPaymentState = async () => {
    if (!passengerId || !rideId) {
      setLoadingPayment(false);
      return;
    }

    try {
      setLoadingPayment(true);
      const status = await getRidePaymentStatus(rideId, passengerId);
      setPaymentStatus(status);
      setLocalPayPalOrderId(status?.payPalOrderId ?? '');
    } catch (error: any) {
      Alert.alert('Payment Error', error?.response?.data || 'Failed to load payment details.');
    } finally {
      setLoadingPayment(false);
    }
  };

  useEffect(() => {
    handleGetPendingFeedbackRide();
  }, [handleGetPendingFeedbackRide, notificationRefreshAt]);

  useEffect(() => {
    loadPaymentState();
  }, [passengerId, rideId]);

  if (notLoggedIn) {
    return <Redirect href="/(auth)" />;
  }

  if (loadingUser || loadingPayment) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading payment...</Text>
      </View>
    );
  }

  if (!rideId || !pendingFeedbackRide) {
    return (
      <View style={styles.screen}>
        <AppNavbar
          fullName={user?.fullName}
          profileRoute="/(main)/passenger-profile"
          profileImageStorageKey={
            user?.passengerId ? `passenger_profile_image_url_${user.passengerId}` : undefined
          }
        />
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>No ride waiting for payment</Text>
            <Text style={styles.helperText}>
              There is no completed ride ready for payment right now.
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.replace('/(main)/passenger')}
            >
              <Text style={styles.primaryButtonText}>Return Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  const isPaymentComplete = paymentStatus?.status?.toLowerCase() === 'paid';

  const handleStartPayment = async () => {
    if (!passengerId || !rideId) return;

    try {
      setIsCreatingOrder(true);
      const createdOrder = await createRidePaymentOrder({ rideId, passengerId });
      setLocalPayPalOrderId(createdOrder.payPalOrderId);

      if (!createdOrder.approvalUrl) {
        Alert.alert('Payment Error', 'PayPal approval link was not returned.');
        return;
      }

      await WebBrowser.openBrowserAsync(createdOrder.approvalUrl);
      await loadPaymentState();
    } catch (error: any) {
      Alert.alert('Payment Error', error?.response?.data || 'Failed to start PayPal payment.');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleCapturePayment = async () => {
    if (!passengerId || !rideId) return;

    const payPalOrderId = paymentStatus?.payPalOrderId || localPayPalOrderId;
    if (!payPalOrderId) {
      Alert.alert('Payment Error', 'No PayPal order was found for this ride yet.');
      return;
    }

    try {
      setIsCapturingOrder(true);
      await captureRidePaymentOrder({
        rideId,
        passengerId,
        payPalOrderId,
      });

      await loadPaymentState();
      router.replace({
        pathname: '/(main)/passenger-feedback',
        params: { rideId: String(rideId) },
      });
    } catch (error: any) {
      Alert.alert(
        'Capture Failed',
        error?.response?.data || 'We could not confirm the PayPal payment yet.'
      );
    } finally {
      setIsCapturingOrder(false);
    }
  };

  return (
    <View style={styles.screen}>
      <AppNavbar
        fullName={user?.fullName}
        profileRoute="/(main)/passenger-profile"
        profileImageStorageKey={
          user?.passengerId ? `passenger_profile_image_url_${user.passengerId}` : undefined
        }
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.paymentHeaderCard}>
          <View style={styles.paymentHeaderTopRow}>
            <View style={{ flex: 1, paddingRight: 14 }}>
              <Text style={styles.paymentHeaderEyebrow}>Final step</Text>
              <Text style={styles.paymentHeaderTitle}>Complete payment</Text>
              <Text style={styles.paymentHeaderSubtitle}>
                Pay for this ride and the driver will instantly see your confirmation.
              </Text>
            </View>

            <View style={styles.paymentHeaderIconBadge}>
              <MaterialCommunityIcons name="credit-card-outline" size={28} color="#ffffff" />
            </View>
          </View>

          <View style={styles.paymentQuickStatsRow}>
            <View style={styles.paymentQuickStatCard}>
              <Text style={styles.paymentQuickStatLabel}>Ride</Text>
              <Text style={styles.paymentQuickStatValue}>#{pendingFeedbackRide.id}</Text>
              <Text style={styles.paymentQuickStatHint}>Completed trip</Text>
            </View>

            <View style={styles.paymentQuickStatCard}>
              <Text style={styles.paymentQuickStatLabel}>Status</Text>
              <Text style={styles.paymentQuickStatValue}>
                {isPaymentComplete ? 'Paid' : paymentStatus?.payPalOrderId ? 'Awaiting confirm' : 'Ready'}
              </Text>
              <Text style={styles.paymentQuickStatHint}>PayPal checkout</Text>
            </View>
          </View>
        </View>

        <View style={styles.paymentSummaryCard}>
          <Text style={styles.cardTitle}>Ride Summary</Text>
          <Text style={styles.helperText}>
            Review the fare details before finishing the trip payment.
          </Text>

          <View style={styles.paymentRideRoute}>
            <Text style={styles.paymentRouteLabel}>Pickup</Text>
            <Text style={styles.paymentRouteValue}>
              {pendingFeedbackRide.pickupLocation || 'Unknown pickup'}
            </Text>
            <View style={styles.paymentRouteDivider} />
            <Text style={styles.paymentRouteLabel}>Destination</Text>
            <Text style={styles.paymentRouteValue}>
              {pendingFeedbackRide.destination || 'Unknown destination'}
            </Text>
          </View>

          <View style={styles.paymentBreakdownCard}>
            <View style={styles.paymentBreakdownRow}>
              <Text style={styles.paymentBreakdownLabel}>Base fare</Text>
              <Text style={styles.paymentBreakdownValue}>
                {paymentStatus?.baseFare != null
                  ? formatCurrencyAmount(paymentStatus.baseFare, paymentStatus.currencyCode)
                  : 'Preparing'}
              </Text>
            </View>

            <View style={styles.paymentBreakdownRow}>
              <Text style={styles.paymentBreakdownLabel}>Estimated distance</Text>
              <Text style={styles.paymentBreakdownValue}>
                {paymentStatus?.distanceKm != null ? `${paymentStatus.distanceKm.toFixed(2)} km` : 'Preparing'}
              </Text>
            </View>

            <View style={styles.paymentBreakdownRow}>
              <Text style={styles.paymentBreakdownLabel}>Estimated duration</Text>
              <Text style={styles.paymentBreakdownValue}>
                {paymentStatus?.durationMinutes != null ? `${paymentStatus.durationMinutes} min` : 'Preparing'}
              </Text>
            </View>

            <View style={styles.paymentBreakdownDivider} />

            <View style={styles.paymentBreakdownRow}>
              <Text style={styles.paymentTotalLabel}>Total to pay</Text>
              <Text style={styles.paymentTotalValue}>
                {paymentStatus
                  ? formatCurrencyAmount(paymentStatus.amount, paymentStatus.currencyCode)
                  : 'Preparing...'}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.statusBanner,
              isPaymentComplete ? styles.successBannerSoft : styles.warningBannerSoft,
            ]}
          >
            <Text style={styles.statusTitle}>
              {isPaymentComplete ? 'Payment confirmed' : 'Payment required'}
            </Text>
            <Text style={styles.helperText}>
              {isPaymentComplete
                ? 'Your driver has been notified that the payment is complete.'
                : paymentStatus?.payPalOrderId
                  ? 'If you already approved the ride in PayPal, confirm it below.'
                  : 'Open PayPal to review the fare and approve the payment.'}
            </Text>
          </View>

          {!paymentStatus?.payPalOrderId ? (
            <TouchableOpacity
              style={[styles.primaryButton, isCreatingOrder && styles.primaryButtonDisabled]}
              onPress={handleStartPayment}
              disabled={isCreatingOrder}
            >
              <Text style={styles.primaryButtonText}>
                {isCreatingOrder ? 'Preparing PayPal...' : 'Pay with PayPal'}
              </Text>
            </TouchableOpacity>
          ) : !isPaymentComplete ? (
            <View style={styles.paymentActionsWrap}>
              <TouchableOpacity
                style={[styles.secondaryButton, isCreatingOrder && styles.secondaryButtonDisabled]}
                onPress={handleStartPayment}
                disabled={isCreatingOrder}
              >
                <Text style={styles.secondaryButtonText}>
                  {isCreatingOrder ? 'Opening PayPal...' : 'Open PayPal Again'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.primaryButton, isCapturingOrder && styles.primaryButtonDisabled]}
                onPress={handleCapturePayment}
                disabled={isCapturingOrder}
              >
                <Text style={styles.primaryButtonText}>
                  {isCapturingOrder ? 'Confirming Payment...' : 'I Completed Payment'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() =>
                router.replace({
                  pathname: '/(main)/passenger-feedback',
                  params: { rideId: String(rideId) },
                })
              }
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
