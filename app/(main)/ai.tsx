import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AppNavbar from '../../src/components/AppNavbar';
import CancelRideModal from '../../src/components/shared/CancelRideModal';
import { useAiManagerScreen } from '../../src/hooks/useAiManagerScreen';

function formatWait(minutes: number | null | undefined) {
  if (minutes == null) return 'Wait time unavailable';
  if (minutes <= 0) return 'Waiting less than 1 min';
  return `Waiting ${minutes} min`;
}

function formatEta(minutes: number | null | undefined, emptyLabel: string) {
  if (minutes == null) return emptyLabel;
  if (minutes <= 0) return 'Less than 1 min';
  return `${minutes} min`;
}

function formatLastUpdated(date: Date | null) {
  if (!date) return 'Waiting for first dashboard sync';

  return `Last synced ${date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

function formatDateTime(value?: string | null, emptyLabel = 'Not available') {
  if (!value) return emptyLabel;

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return emptyLabel;
  }

  return parsed.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatRating(value: number | null | undefined) {
  if (value == null) return 'Rating unavailable';
  return `${value.toFixed(1)} avg rating`;
}

export default function AiManagerScreen() {
  const router = useRouter();
  const [selectedRideToCancel, setSelectedRideToCancel] = useState<number | null>(null);
  const {
    user,
    loadingUser,
    notLoggedIn,
    summary,
    activeRides,
    availableDrivers,
    pendingRecommendations,
    bestDriver,
    rideId,
    message,
    lastUpdatedAt,
    isRefreshingDashboard,
    isAnalyzingRide,
    cancellingRideId,
    longestWaitingRide,
    setRideId,
    handleRefreshDashboard,
    handleAnalyzeRide,
    handleCancelRideAsManager,
  } = useAiManagerScreen();

  if (notLoggedIn) {
    return <Redirect href="/(auth)" />;
  }

  if (loadingUser) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading AI manager data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <AppNavbar
        fullName={user?.fullName}
        notificationsRoute="/(main)/notifications"
        subtitle="AI manager dashboard"
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroIconWrap}>
              <Text style={styles.heroIcon}>AI</Text>
            </View>

            <View style={styles.heroTextWrap}>
              <Text style={styles.title}>Operations Monitor</Text>
              <Text style={styles.subtitle}>
                This dashboard watches dispatch health, active rides, available drivers,
                and current recommendation output across the application.
              </Text>
            </View>
          </View>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatPill}>
              <Text style={styles.heroStatLabel}>Active rides</Text>
              <Text style={styles.heroStatValue}>{summary?.activeRidesCount ?? 0}</Text>
            </View>

            <View style={styles.heroStatPill}>
              <Text style={styles.heroStatLabel}>Pending rides</Text>
              <Text style={styles.heroStatValue}>{summary?.pendingRidesCount ?? 0}</Text>
            </View>

            <View style={styles.heroStatPill}>
              <Text style={styles.heroStatLabel}>Available drivers</Text>
              <Text style={styles.heroStatValue}>{summary?.availableDriversCount ?? 0}</Text>
            </View>
          </View>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatPill}>
              <Text style={styles.heroStatLabel}>Drivers online</Text>
              <Text style={styles.heroStatValue}>{summary?.driversOnlineCount ?? 0}</Text>
            </View>

            <View style={styles.heroStatPill}>
              <Text style={styles.heroStatLabel}>Drivers busy</Text>
              <Text style={styles.heroStatValue}>{summary?.driversBusyCount ?? 0}</Text>
            </View>

            <View style={styles.heroStatPill}>
              <Text style={styles.heroStatLabel}>Avg pickup ETA</Text>
              <Text style={styles.heroStatValue}>
                {formatEta(summary?.averagePickupEtaMinutes, 'ETA pending')}
              </Text>
            </View>
          </View>

          <View style={styles.heroFooterRow}>
            <Text style={styles.heroMetaText}>{formatLastUpdated(lastUpdatedAt)}</Text>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push('/(main)/ai-drivers')}
            >
              <Text style={styles.secondaryButtonText}>View All Drivers</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.secondaryButton,
                isRefreshingDashboard && styles.secondaryButtonDisabled,
              ]}
              onPress={handleRefreshDashboard}
              disabled={isRefreshingDashboard}
            >
              <Text style={styles.secondaryButtonText}>
                {isRefreshingDashboard ? 'Refreshing...' : 'Refresh Monitor'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {message ? (
          <View style={[styles.banner, styles.infoBanner]}>
            <Text style={styles.bannerTitle}>Monitor Update</Text>
            <Text style={styles.bannerText}>{message}</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>System Summary</Text>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Active rides</Text>
              <Text style={styles.summaryValue}>{summary?.activeRidesCount ?? 0}</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Pending rides</Text>
              <Text style={styles.summaryValue}>{summary?.pendingRidesCount ?? 0}</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Available drivers</Text>
              <Text style={styles.summaryValue}>{summary?.availableDriversCount ?? 0}</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Recommendation queue</Text>
              <Text style={styles.summaryValue}>{pendingRecommendations.length}</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Completed today</Text>
              <Text style={styles.summaryValue}>{summary?.completedRidesTodayCount ?? 0}</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Cancelled today</Text>
              <Text style={styles.summaryValue}>{summary?.cancelledRidesTodayCount ?? 0}</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Drivers online</Text>
              <Text style={styles.summaryValue}>{summary?.driversOnlineCount ?? 0}</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Drivers busy</Text>
              <Text style={styles.summaryValue}>{summary?.driversBusyCount ?? 0}</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Unassigned pending</Text>
              <Text style={styles.summaryValue}>
                {summary?.unassignedPendingRidesCount ?? 0}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Average pickup ETA</Text>
              <Text style={styles.summaryValue}>
                {formatEta(summary?.averagePickupEtaMinutes, 'Pending')}
              </Text>
            </View>
          </View>

          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>Current operational note</Text>
            <Text style={styles.insightText}>
              {longestWaitingRide
                ? `Ride #${longestWaitingRide.id} is the longest-running active ride on the board. ${formatWait(
                    longestWaitingRide.waitMinutes
                  )}.`
                : 'No active ride is currently exposing enough timing data for a wait-time highlight.'}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Active Rides</Text>

          {activeRides.length === 0 ? (
            <View style={styles.emptyStateCard}>
              <Text style={styles.emptyStateTitle}>No active rides right now</Text>
              <Text style={styles.emptyStateText}>
                When passengers are matched and rides move beyond pending, they will appear here.
              </Text>
            </View>
          ) : null}

          {activeRides.map((ride) => (
            <View key={ride.id} style={styles.innerCard}>
              <Text style={styles.itemTitle}>Ride #{ride.id}</Text>
              <Text style={styles.itemMeta}>Status: {ride.status || 'Unknown'}</Text>
              <Text style={styles.itemText}>Pickup: {ride.pickupLocation || 'Not available'}</Text>
              <Text style={styles.itemText}>
                Destination: {ride.destination || 'Not available'}
              </Text>
              <Text style={styles.itemText}>
                Passenger:{' '}
                {ride.passengerName ||
                  (ride.passengerId ? `Passenger #${ride.passengerId}` : 'Not assigned')}
              </Text>
              <Text style={styles.itemText}>
                Driver:{' '}
                {ride.driverName ||
                  (ride.driverId ? `Driver #${ride.driverId}` : 'Not assigned')}
              </Text>
              <Text style={styles.itemText}>
                Requested: {formatDateTime(ride.requestedAt || ride.createdAt || ride.requestTime)}
              </Text>
              <Text style={styles.itemText}>
                Scheduled: {formatDateTime(ride.scheduledTime, 'Immediate ride')}
              </Text>
              <Text style={styles.itemText}>
                Pickup ETA: {formatEta(ride.estimatedPickupMinutes, 'ETA not available yet')}
              </Text>
              <Text style={styles.itemText}>
                Trip ETA:{' '}
                {formatEta(ride.estimatedTripDurationMinutes, 'Trip estimate pending')}
              </Text>

              <View style={styles.metaRow}>
                {ride.rideType ? (
                  <View style={styles.metaPill}>
                    <Text style={styles.metaPillText}>{ride.rideType}</Text>
                  </View>
                ) : null}

                <View style={styles.metaPill}>
                  <Text style={styles.metaPillText}>
                    {ride.isShared ? 'Shared ride' : 'Private ride'}
                  </Text>
                </View>

                <View style={styles.metaPill}>
                  <Text style={styles.metaPillText}>{formatWait(ride.waitMinutes)}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.dangerButton,
                  cancellingRideId === ride.id && styles.primaryButtonDisabled,
                ]}
                onPress={() => setSelectedRideToCancel(ride.id)}
                disabled={cancellingRideId === ride.id}
              >
                <Text style={styles.dangerButtonText}>
                  {cancellingRideId === ride.id ? 'Cancelling...' : 'Cancel Ride'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Available Drivers</Text>

          {availableDrivers.length === 0 ? (
            <View style={styles.emptyStateCard}>
              <Text style={styles.emptyStateTitle}>No available drivers listed</Text>
              <Text style={styles.emptyStateText}>
                Drivers who are online and free to receive work will appear here.
              </Text>
            </View>
          ) : null}

          {availableDrivers.map((driver, index) => (
            <View
              key={driver.driverId ?? driver.id ?? `available-driver-${index}`}
              style={styles.innerCard}
            >
              <Text style={styles.itemTitle}>
                {driver.driverName ||
                  driver.fullName ||
                  `Driver #${driver.driverId ?? driver.id ?? '-'}`}
              </Text>
              <Text style={styles.itemMeta}>
                Vehicle: {driver.carModel || 'Vehicle info unavailable'}
              </Text>
              <Text style={styles.itemText}>
                Status: {driver.isOnline ? 'Online' : 'Offline'}
              </Text>
              <Text style={styles.itemText}>
                Plate: {driver.vehiclePlateNumber || 'Plate not available'}
              </Text>
              <Text style={styles.itemText}>
                Contact: {driver.phoneNumber || 'Phone not available'}
              </Text>
              <Text style={styles.itemText}>Rating: {formatRating(driver.rating)}</Text>
              <Text style={styles.itemText}>
                Current ride:{' '}
                {driver.currentRideId != null ? `Ride #${driver.currentRideId}` : 'Available now'}
              </Text>
              <Text style={styles.itemText}>
                Last location update: {formatDateTime(driver.recordedAtUtc, 'No recent fix')}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>AI Recommendations</Text>

          {pendingRecommendations.length === 0 ? (
            <View style={styles.emptyStateCard}>
              <Text style={styles.emptyStateTitle}>No pending recommendations</Text>
              <Text style={styles.emptyStateText}>
                Recommendation items waiting for review or dispatch action will appear here.
              </Text>
            </View>
          ) : null}

          {pendingRecommendations.map((recommendation) => (
            <View key={recommendation.rideId} style={styles.innerCard}>
              <Text style={styles.itemTitle}>Ride #{recommendation.rideId}</Text>
              <Text style={styles.itemMeta}>
                Suggested driver:{' '}
                {recommendation.recommendedDriverName || 'No driver name returned'}
              </Text>
              <Text style={styles.itemText}>
                Passenger:{' '}
                {recommendation.passengerId != null
                  ? `Passenger #${recommendation.passengerId}`
                  : 'Passenger not returned'}
              </Text>
              <Text style={styles.itemText}>
                Score:{' '}
                {recommendation.score != null
                  ? recommendation.score
                  : 'No score returned'}
              </Text>
              <Text style={styles.itemText}>
                Driver rating: {formatRating(recommendation.averageRating)}
              </Text>
              <Text style={styles.itemText}>
                Route: {recommendation.pickupLocation || 'Pickup unavailable'} to{' '}
                {recommendation.destination || 'Destination unavailable'}
              </Text>
              <Text style={styles.itemText}>
                Ride status: {recommendation.rideStatus || 'Status unavailable'}
              </Text>
              <Text style={styles.itemText}>
                Ride setup:{' '}
                {recommendation.rideType || 'Type unavailable'} •{' '}
                {recommendation.isShared ? 'Shared ride' : 'Private ride'}
              </Text>
              <Text style={styles.itemText}>
                Reason:{' '}
                {recommendation.reason ||
                  recommendation.explanation ||
                  'No explanation returned yet'}
              </Text>
              <Text style={styles.itemText}>
                Explanation: {recommendation.explanation || 'No extended explanation returned yet'}
              </Text>

              <TouchableOpacity
                style={[
                  styles.dangerButton,
                  cancellingRideId === recommendation.rideId && styles.primaryButtonDisabled,
                ]}
                onPress={() => setSelectedRideToCancel(recommendation.rideId)}
                disabled={cancellingRideId === recommendation.rideId}
              >
                <Text style={styles.dangerButtonText}>
                  {cancellingRideId === recommendation.rideId
                    ? 'Cancelling...'
                    : 'Cancel Ride'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recommendation Inspector</Text>
          <Text style={styles.helperText}>
            Use a ride ID to inspect the backend&apos;s current best-driver decision for that ride.
          </Text>

          <TextInput
            placeholder="Ride ID"
            value={rideId}
            onChangeText={setRideId}
            style={styles.input}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={[
              styles.primaryButton,
              isAnalyzingRide && styles.primaryButtonDisabled,
            ]}
            onPress={handleAnalyzeRide}
            disabled={isAnalyzingRide}
          >
            <Text style={styles.primaryButtonText}>
              {isAnalyzingRide ? 'Analyzing Ride...' : 'Analyze Recommendation'}
            </Text>
          </TouchableOpacity>

          {bestDriver ? (
            <View style={styles.innerCard}>
              <Text style={styles.itemText}>
                Ride ID: {bestDriver.rideId ?? 'Not returned'}
              </Text>
              <Text style={styles.itemTitle}>
                {bestDriver.driverName || 'No driver selected'}
              </Text>
              <Text style={styles.itemText}>
                Driver ID: {bestDriver.driverId ?? 'Not returned'}
              </Text>
              <Text style={styles.itemText}>
                Score: {bestDriver.score != null ? bestDriver.score : 'Not returned'}
              </Text>
              <Text style={styles.itemText}>
                Rating: {formatRating(bestDriver.averageRating)}
              </Text>
              <Text style={styles.itemText}>
                Completed rides: {bestDriver.completedRides ?? 'Not returned'}
              </Text>
              <Text style={styles.itemText}>
                Polite count: {bestDriver.politeCount ?? 'Not returned'}
              </Text>
              <Text style={styles.itemText}>
                On-time count: {bestDriver.onTimeCount ?? 'Not returned'}
              </Text>
              <Text style={styles.itemText}>
                Clean vehicle count: {bestDriver.cleanVehicleCount ?? 'Not returned'}
              </Text>
              <Text style={styles.itemText}>
                Reason:{' '}
                {bestDriver.reason ||
                  bestDriver.explanation ||
                  'No explanation returned'}
              </Text>
              <Text style={styles.itemText}>
                Explanation: {bestDriver.explanation || 'No extended explanation returned'}
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <CancelRideModal
        visible={selectedRideToCancel != null}
        title="Manager cancel ride?"
        subtitle="Manager cancellation overrides the normal ride flow. Use this for safety, ops, or service recovery cases."
        confirmLabel="Cancel as manager"
        reasons={[
          'Safety or service issue',
          'Passenger request confirmed by support',
          'Driver unavailable',
          'Dispatch correction needed',
        ]}
        allowNote
        onClose={() => setSelectedRideToCancel(null)}
        onConfirm={async (reason, note) => {
          if (selectedRideToCancel == null) return;
          const success = await handleCancelRideAsManager(
            selectedRideToCancel,
            reason,
            note
          );
          if (success) {
            setSelectedRideToCancel(null);
          }
        }}
        isSubmitting={selectedRideToCancel != null && cancellingRideId === selectedRideToCancel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#374151',
  },
  heroCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 20,
    marginBottom: 14,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecfccb',
    borderWidth: 1,
    borderColor: '#d9f99d',
    marginRight: 14,
  },
  heroIcon: {
    color: '#365314',
    fontSize: 18,
    fontWeight: '800',
  },
  heroTextWrap: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    color: '#111827',
  },
  subtitle: {
    color: '#4b5563',
    fontSize: 14,
    lineHeight: 20,
  },
  heroStatsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  heroStatPill: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  heroStatLabel: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  heroStatValue: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
  },
  heroFooterRow: {
    marginTop: 16,
    gap: 10,
  },
  heroMetaText: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 18,
    marginBottom: 14,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
    color: '#111827',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  summaryItem: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 12,
    backgroundColor: '#f9fafb',
    width: '48%',
  },
  summaryLabel: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  summaryValue: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '800',
  },
  insightCard: {
    borderWidth: 1,
    borderColor: '#d9f99d',
    backgroundColor: '#f7fee7',
    borderRadius: 18,
    padding: 14,
    marginTop: 12,
  },
  insightTitle: {
    color: '#3f6212',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 6,
  },
  insightText: {
    color: '#365314',
    fontSize: 13,
    lineHeight: 19,
  },
  innerCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 14,
    marginTop: 10,
    borderRadius: 18,
    backgroundColor: '#fcfcfc',
  },
  itemTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  itemMeta: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  itemText: {
    color: '#4b5563',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  metaPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  metaPillText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyStateCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 18,
    padding: 16,
    backgroundColor: '#f9fafb',
    marginTop: 6,
  },
  emptyStateTitle: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptyStateText: {
    color: '#6b7280',
    fontSize: 13,
    lineHeight: 19,
  },
  helperText: {
    color: '#6b7280',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#ffffff',
  },
  primaryButton: {
    backgroundColor: '#111827',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  secondaryButtonDisabled: {
    opacity: 0.6,
  },
  secondaryButtonText: {
    color: '#1f2937',
    fontWeight: '700',
    fontSize: 15,
  },
  banner: {
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  infoBanner: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  bannerTitle: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    color: '#1f2937',
    marginBottom: 4,
  },
  bannerText: {
    color: '#111827',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
  dangerButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
    backgroundColor: '#fff7f7',
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 13,
  },
  dangerButtonText: {
    color: '#991b1b',
    fontWeight: '700',
    fontSize: 14,
  },
});
