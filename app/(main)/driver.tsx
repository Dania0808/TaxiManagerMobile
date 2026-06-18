import { Redirect } from 'expo-router';
import {
  ActivityIndicator,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useState } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';

import AppNavbar from '../../src/components/AppNavbar';
import CancelRideModal from '../../src/components/shared/CancelRideModal';
import { useDriverScreen } from '../../src/hooks/useDriverScreen';
import { AvailableRideType } from '../../src/types/driver';
import { driverStyles as styles } from '../../src/styles/driverStyles';

const RELEVANT_RIDE_RADIUS_KM = 15;
const PICKUP_SPEED_KM_PER_HOUR = 28;
const TRIP_SPEED_KM_PER_HOUR = 32;

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function distanceKm(
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number
) {
  const earthRadiusKm = 6371;
  const deltaLatitude = toRadians(latitude2 - latitude1);
  const deltaLongitude = toRadians(longitude2 - longitude1);
  const startLatitude = toRadians(latitude1);
  const endLatitude = toRadians(latitude2);

  const a =
    Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
    Math.sin(deltaLongitude / 2) *
      Math.sin(deltaLongitude / 2) *
      Math.cos(startLatitude) *
      Math.cos(endLatitude);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatWait(minutes: number | null | undefined) {
  if (minutes == null) return 'Wait time unavailable';
  if (minutes <= 0) return 'Waiting less than 1 min';
  return `Waiting ${minutes} min`;
}

function formatTripDuration(minutes: number | null | undefined) {
  if (minutes == null) return 'Trip duration unavailable';
  return `${minutes} min estimated trip`;
}

function estimateMinutesFromDistance(
  distanceKilometers: number | null,
  averageSpeedKmPerHour: number
) {
  if (
    distanceKilometers == null ||
    !Number.isFinite(distanceKilometers) ||
    distanceKilometers < 0 ||
    averageSpeedKmPerHour <= 0
  ) {
    return null;
  }

  return Math.max(1, Math.round((distanceKilometers / averageSpeedKmPerHour) * 60));
}

function formatDistanceFromDriver(
  ride: AvailableRideType,
  currentCoords: { latitude: number; longitude: number } | null
) {
  if (
    !currentCoords ||
    ride.pickupLatitude == null ||
    ride.pickupLongitude == null
  ) {
    return null;
  }

  const km = distanceKm(
    currentCoords.latitude,
    currentCoords.longitude,
    ride.pickupLatitude,
    ride.pickupLongitude
  );

  if (km < 1) {
    return `${Math.round(km * 1000)} m away`;
  }

  return `${km.toFixed(1)} km away`;
}

function getDistanceFromDriverKm(
  ride: AvailableRideType,
  currentCoords: { latitude: number; longitude: number } | null
) {
  if (
    !currentCoords ||
    ride.pickupLatitude == null ||
    ride.pickupLongitude == null
  ) {
    return null;
  }

  return distanceKm(
    currentCoords.latitude,
    currentCoords.longitude,
    ride.pickupLatitude,
    ride.pickupLongitude
  );
}

function getEstimatedTripMinutesForRide(ride: {
  pickupLatitude?: number | null;
  pickupLongitude?: number | null;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
  estimatedTripDurationMinutes?: number | null;
}) {
  if (ride.estimatedTripDurationMinutes != null) {
    return ride.estimatedTripDurationMinutes;
  }

  if (
    ride.pickupLatitude == null ||
    ride.pickupLongitude == null ||
    ride.destinationLatitude == null ||
    ride.destinationLongitude == null
  ) {
    return null;
  }

  const tripDistanceKm = distanceKm(
    ride.pickupLatitude,
    ride.pickupLongitude,
    ride.destinationLatitude,
    ride.destinationLongitude
  );

  return estimateMinutesFromDistance(tripDistanceKm, TRIP_SPEED_KM_PER_HOUR);
}

function getEstimatedPickupMinutesForRide(
  ride: {
    pickupLatitude?: number | null;
    pickupLongitude?: number | null;
    estimatedPickupMinutes?: number | null;
  },
  currentCoords: { latitude: number; longitude: number } | null
) {
  if (ride.estimatedPickupMinutes != null) {
    return ride.estimatedPickupMinutes;
  }

  const pickupDistanceKm = getDistanceFromDriverKm(
    {
      id: 0,
      pickupLocation: '',
      destination: '',
      rideType: '',
      isShared: false,
      pickupLatitude: ride.pickupLatitude,
      pickupLongitude: ride.pickupLongitude,
    },
    currentCoords
  );

  return estimateMinutesFromDistance(pickupDistanceKm, PICKUP_SPEED_KM_PER_HOUR);
}

function getDriverPhaseCopy(phase: string) {
  if (phase === 'offline') {
    return {
      title: 'You are offline',
      subtitle:
        'Go online when you are ready to receive nearby passenger requests and share your location.',
    };
  }

  if (phase === 'incoming_offer') {
    return {
      title: 'Incoming request waiting for your decision',
      subtitle:
        'Review the pickup quickly. Accepting now reserves the trip for you and starts navigation.',
    };
  }

  if (phase === 'heading_to_pickup') {
    return {
      title: 'Head to the pickup point',
      subtitle:
        'Use navigation and keep the ride status updated so the passenger knows what is happening.',
    };
  }

  if (phase === 'trip_in_progress') {
    return {
      title: 'Passenger on board',
      subtitle:
        'Focus the screen on navigation, destination details, and the final completion step.',
    };
  }

  if (phase === 'completed') {
    return {
      title: 'Ride complete',
      subtitle:
        'Refresh once to clear the finished trip and return to waiting mode for the next request.',
    };
  }

  return {
    title: 'Online and waiting',
    subtitle:
      'You are visible to nearby passengers. The closest suitable requests will surface here first.',
  };
}

function getRideWaitMinutes(ride: AvailableRideType) {
  const rawDate = ride.requestedAt || ride.createdAt;
  if (!rawDate) return null;

  const parsedDate = new Date(rawDate);
  if (Number.isNaN(parsedDate.getTime())) return null;

  return Math.max(0, Math.floor((Date.now() - parsedDate.getTime()) / 60000));
}

function getTripStage(
  status?: string | null
): {
  title: string;
  subtitle: string;
  actionLabel: string | null;
  nextStatus: string | null;
  targetLabel: string;
} {
  if (status === 'PickedUp') {
    return {
      title: 'Passenger On Board',
      subtitle: 'Drive safely to the destination and complete the trip when you arrive.',
      actionLabel: 'Complete Ride',
      nextStatus: 'Completed',
      targetLabel: 'Destination',
    };
  }

  if (status === 'OnTheWay') {
    return {
      title: 'Heading To Pickup',
      subtitle: 'You are on the way to the passenger. Mark pickup once they are in the car.',
      actionLabel: 'Picked Up Passenger',
      nextStatus: 'PickedUp',
      targetLabel: 'Pickup',
    };
  }

  if (status === 'Completed') {
    return {
      title: 'Trip Complete',
      subtitle: 'This ride is complete. Refresh to return to waiting mode.',
      actionLabel: null,
      nextStatus: null,
      targetLabel: 'Completed',
    };
  }

  return {
    title: 'Claimed / Accepted',
    subtitle: 'Review the pickup details and start heading to the passenger.',
    actionLabel: 'Start Navigation To Pickup',
    nextStatus: 'OnTheWay',
    targetLabel: 'Pickup',
  };
}

export default function DriverScreen() {
  const [selectedOpenRideId, setSelectedOpenRideId] = useState<number | null>(null);
  const [showAllRelevantRides, setShowAllRelevantRides] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const {
    user,
    loadingUser,
    notLoggedIn,
    isOnline,
    driverScreenState,
    driverPhase,
    openRideRequests,
    incomingOffer,
    currentRide,
    trackingSnapshot,
    trackingUnavailable,
    currentCoords,
    locationError,
    message,
    navigationTarget,
    activeRideWaitMinutes,
    incomingOfferWaitMinutes,
    incomingOfferCountdownSeconds,
    estimatedTripDurationMinutes,
    defaultCoords,
    isTogglingOnline,
    isRefreshingRequests,
    isRefreshingRide,
    isRefreshingTracking,
    activeOfferActionId,
    activeClaimRideId,
    isUpdatingRideStatus,
    isCancellingRide,
    handleAcceptRide,
    handleClaimOpenRideRequest,
    handleDeclineIncomingOffer,
    handleToggleOnlineStatus,
    handleGetOpenRideRequests,
    handleGetCurrentRide,
    handleUpdateRideStatus,
    handleRefreshTracking,
    handleOpenExternalNavigation,
    handleCancelCurrentRide,
  } = useDriverScreen();

  if (notLoggedIn) {
    return <Redirect href="/(auth)" />;
  }

  if (loadingUser) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading driver data...</Text>
      </View>
    );
  }

  const pickupCoords =
    currentRide?.pickupLatitude != null && currentRide?.pickupLongitude != null
      ? {
          latitude: currentRide.pickupLatitude,
          longitude: currentRide.pickupLongitude,
        }
      : null;

  const destinationCoords =
    currentRide?.destinationLatitude != null &&
    currentRide?.destinationLongitude != null
      ? {
          latitude: currentRide.destinationLatitude,
          longitude: currentRide.destinationLongitude,
        }
      : null;

  const passengerCoords = trackingSnapshot?.passengerLocation
    ? {
        latitude: trackingSnapshot.passengerLocation.latitude,
        longitude: trackingSnapshot.passengerLocation.longitude,
      }
    : null;

  const incomingPickupCoords =
    incomingOffer?.pickupLatitude != null && incomingOffer?.pickupLongitude != null
      ? {
          latitude: incomingOffer.pickupLatitude,
          longitude: incomingOffer.pickupLongitude,
        }
      : null;

  const targetCoords = navigationTarget.coords;
  const mapCenter =
    currentCoords ??
    targetCoords ??
    pickupCoords ??
    destinationCoords ??
    incomingPickupCoords ??
    defaultCoords;

  const openRequestsWithCoords = openRideRequests.filter(
    (ride) => ride.pickupLatitude != null && ride.pickupLongitude != null
  );
  const relevantOpenRequests =
    currentCoords && openRequestsWithCoords.length > 0
      ? openRequestsWithCoords.filter(
          (ride) =>
            distanceKm(
              currentCoords.latitude,
              currentCoords.longitude,
              ride.pickupLatitude as number,
              ride.pickupLongitude as number
            ) <= RELEVANT_RIDE_RADIUS_KM
        )
      : openRideRequests;
  const sortedRelevantOpenRequests =
    currentCoords && relevantOpenRequests.length > 0
      ? [...relevantOpenRequests].sort((rideA, rideB) => {
          const rideADistance = distanceKm(
            currentCoords.latitude,
            currentCoords.longitude,
            rideA.pickupLatitude as number,
            rideA.pickupLongitude as number
          );
          const rideBDistance = distanceKm(
            currentCoords.latitude,
            currentCoords.longitude,
            rideB.pickupLatitude as number,
            rideB.pickupLongitude as number
          );

          return rideADistance - rideBDistance;
        })
      : relevantOpenRequests;
  const closestRelevantRide = sortedRelevantOpenRequests[0] ?? null;
  const visibleRelevantRides = showAllRelevantRides
    ? sortedRelevantOpenRequests
    : sortedRelevantOpenRequests.slice(0, 3);
  const selectedOpenRide =
    sortedRelevantOpenRequests.find((ride) => ride.id === selectedOpenRideId) ??
    sortedRelevantOpenRequests[0] ??
    null;
  const selectedRideIsClosest =
    selectedOpenRide != null && closestRelevantRide != null
      ? selectedOpenRide.id === closestRelevantRide.id
      : false;
  const stateTitle =
    driverScreenState === 'offline'
      ? 'Offline'
      : driverScreenState === 'incoming_request'
        ? 'Incoming Request'
        : driverScreenState === 'en_route_pickup'
          ? 'En Route to Pickup'
          : driverScreenState === 'passenger_on_board'
            ? 'Passenger On Board'
            : driverScreenState === 'ride_complete'
              ? 'Ride Complete'
              : 'Online and Waiting';
  const tripStage = getTripStage(currentRide?.status);
  const phaseCopy = getDriverPhaseCopy(driverPhase);
  const isOfferActionLoading =
    incomingOffer?.offerId != null && activeOfferActionId === incomingOffer.offerId;
  const currentRideTripEstimateMinutes =
    currentRide != null ? getEstimatedTripMinutesForRide(currentRide) : null;
  const selectedRidePickupEtaMinutes =
    selectedOpenRide != null
      ? getEstimatedPickupMinutesForRide(selectedOpenRide, currentCoords)
      : null;
  const selectedRideTripEstimateMinutes =
    selectedOpenRide != null ? getEstimatedTripMinutesForRide(selectedOpenRide) : null;

  return (
    <View style={styles.screen}>
      <AppNavbar
        fullName={user?.fullName}
        profileRoute="/(main)/driver-profile"
        notificationsRoute="/(main)/notifications"
        profileImageStorageKey={
          user?.driverId ? `driver_profile_image_url_${user.driverId}` : undefined
        }
        subtitle="Driver dashboard"
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCardCompact}>
          <View style={styles.heroPanel}>
            <View style={styles.heroPanelTopRow}>
              <View style={styles.heroTextWrap}>
                <Text style={styles.heroEyebrow}>Driver mode</Text>
                <Text style={styles.heroHeadline}>
                  {isOnline ? 'Ready for the next pickup' : 'Go online to start receiving rides'}
                </Text>
                <Text style={styles.heroSubtitleStrong}>{phaseCopy.title}</Text>
              </View>

              <View
                style={[
                  styles.heroStatusBadge,
                  isOnline ? styles.heroStatusBadgeOnline : styles.heroStatusBadgeOffline,
                ]}
              >
                <Text
                  style={[
                    styles.heroStatusBadgeText,
                    isOnline
                      ? styles.heroStatusBadgeTextOnline
                      : styles.heroStatusBadgeTextOffline,
                  ]}
                >
                  {isTogglingOnline ? 'Updating' : isOnline ? 'Online' : 'Offline'}
                </Text>
              </View>
            </View>

            <View style={styles.heroDivider} />

            <View style={styles.heroMetricsRow}>
              <View style={styles.heroMetricCard}>
                <Text style={styles.heroMetricLabel}>Status</Text>
                <Text style={styles.heroMetricValue}>{stateTitle}</Text>
                <Text style={styles.heroMetricHint}>Live dispatch state</Text>
              </View>

              <View style={styles.heroMetricCard}>
                <Text style={styles.heroMetricLabel}>Nearby rides</Text>
                <Text style={styles.heroMetricValue}>{relevantOpenRequests.length}</Text>
                <Text style={styles.heroMetricHint}>
                  {isOnline ? 'Closest rides first' : 'Visible once online'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.driverAvailabilityStrip}>
            <View style={styles.driverAvailabilityTextWrap}>
              <Text style={styles.availabilityLabel}>
                {isOnline ? 'Receiving new ride requests' : 'Driver availability'}
              </Text>
              <Text style={styles.driverAvailabilityValue}>
                {isTogglingOnline ? 'Updating...' : isOnline ? 'Online' : 'Offline'}
              </Text>
            </View>
            <Switch
              value={isOnline}
              onValueChange={handleToggleOnlineStatus}
              disabled={isTogglingOnline}
            />
          </View>

          <Text style={styles.heroFooterNote}>
            {isOnline
              ? 'Stay visible on the map and claim the best pickup quickly.'
              : 'Turn on availability when you are ready to appear for nearby passengers.'}
          </Text>
        </View>

        {message && message !== 'You are online and ready for new nearby ride requests.' ? (
          <View
            style={[
              styles.globalBanner,
              driverPhase === 'offline'
                ? styles.infoBanner
                : driverPhase === 'incoming_offer'
                  ? styles.warningBanner
                  : styles.successBanner,
            ]}
          >
            <Text style={styles.globalBannerTitle}>Dispatch Update</Text>
            <Text style={styles.globalBannerText}>{message}</Text>
          </View>
        ) : null}

        {locationError ? (
          <View style={[styles.globalBanner, styles.warningBanner]}>
            <Text style={styles.globalBannerTitle}>Location Needed</Text>
            <Text style={styles.globalBannerText}>{locationError}</Text>
          </View>
        ) : null}

        {currentRide ? (
          <View style={styles.card}>
            <View style={styles.cardTitleRow}>
              <View style={styles.cardTitleIconWrap}>
                <Text style={styles.cardTitleIcon}>N</Text>
              </View>
              <Text style={styles.cardTitle}>Navigation</Text>
            </View>

            <MapView
              style={styles.map}
              region={{
                latitude: mapCenter.latitude,
                longitude: mapCenter.longitude,
                latitudeDelta: 0.03,
                longitudeDelta: 0.03,
              }}
            >
              {pickupCoords ? (
                <Marker
                  coordinate={pickupCoords}
                  title="Pickup"
                  description={currentRide.pickupLocation}
                  pinColor="green"
                />
              ) : null}

              {destinationCoords ? (
                <Marker
                  coordinate={destinationCoords}
                  title="Destination"
                  description={currentRide.destination}
                  pinColor="red"
                />
              ) : null}

              {passengerCoords ? (
                <Marker
                  coordinate={passengerCoords}
                  title="Passenger"
                  description="Passenger live location"
                  pinColor="orange"
                />
              ) : null}

              {currentCoords ? (
                <Marker
                  coordinate={currentCoords}
                  title="You"
                  description="Driver live location"
                  pinColor="blue"
                />
              ) : null}

              {currentCoords && targetCoords ? (
                <Polyline
                  coordinates={[currentCoords, targetCoords]}
                  strokeWidth={4}
                  strokeColor="#2563eb"
                />
              ) : null}
            </MapView>

            <View style={styles.statusBanner}>
              <Text style={styles.statusTitle}>{tripStage.title}</Text>
              <Text style={styles.helperText}>{tripStage.subtitle}</Text>
              <Text style={styles.helperText}>
                Current target: {tripStage.targetLabel}
              </Text>
              <Text style={styles.helperText}>
                {navigationTarget.title}: {navigationTarget.subtitle}
              </Text>
              <Text style={styles.helperText}>
                Passenger wait: {formatWait(activeRideWaitMinutes)}
              </Text>
              <Text style={styles.helperText}>
                {formatTripDuration(currentRideTripEstimateMinutes ?? estimatedTripDurationMinutes)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleOpenExternalNavigation}
            >
              <Text style={styles.actionButtonText}>Open Turn-by-Turn Navigation</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.secondaryButton,
                isRefreshingTracking && styles.secondaryButtonDisabled,
              ]}
              onPress={handleRefreshTracking}
              disabled={isRefreshingTracking}
            >
              <Text style={styles.secondaryButtonText}>
                {isRefreshingTracking ? 'Refreshing Live Data...' : 'Refresh Live Data'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.refreshMetaText}>
              {trackingUnavailable
                ? 'Live tracking is temporarily unavailable.'
                : 'Driver and passenger locations refresh automatically while the trip is active.'}
            </Text>
          </View>
        ) : null}

        {currentRide ? (
          <View style={styles.card}>
            <View style={styles.cardTitleRow}>
              <View style={styles.cardTitleIconWrap}>
                <Text style={styles.cardTitleIcon}>J</Text>
              </View>
              <Text style={styles.cardTitle}>Trip Workflow</Text>
            </View>

            <View style={styles.tripStageCard}>
              <Text style={styles.tripStageTitle}>{tripStage.title}</Text>
              <Text style={styles.tripStageSubtitle}>{tripStage.subtitle}</Text>
            </View>

            <View style={styles.tripInfoGrid}>
              <View style={styles.tripInfoBlock}>
                <Text style={styles.cardBodyTitle}>Passenger</Text>
                <Text style={styles.cardBodyValue}>
                  {currentRide.passengerName || `Passenger #${currentRide.passengerId}`}
                </Text>
              </View>

              <View style={styles.tripInfoBlock}>
                <Text style={styles.cardBodyTitle}>Status</Text>
                <Text style={styles.cardBodyValue}>{currentRide.status}</Text>
              </View>

              <View style={styles.tripInfoBlockWide}>
                <Text style={styles.cardBodyTitle}>Pickup</Text>
                <Text style={styles.cardBodyValue}>{currentRide.pickupLocation}</Text>
              </View>

              <View style={styles.tripInfoBlockWide}>
                <Text style={styles.cardBodyTitle}>Destination</Text>
                <Text style={styles.cardBodyValue}>{currentRide.destination}</Text>
              </View>

              <View style={styles.tripInfoBlock}>
                <Text style={styles.cardBodyTitle}>Passenger Wait</Text>
                <Text style={styles.cardBodyValue}>{formatWait(activeRideWaitMinutes)}</Text>
              </View>

              <View style={styles.tripInfoBlock}>
                <Text style={styles.cardBodyTitle}>Estimated Drive</Text>
                <Text style={styles.cardBodyValue}>
                  {formatTripDuration(currentRideTripEstimateMinutes ?? estimatedTripDurationMinutes)}
                </Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaPill}>
                <Text style={styles.metaPillText}>{currentRide.rideType}</Text>
              </View>
              <View style={styles.metaPill}>
                <Text style={styles.metaPillText}>
                  {currentRide.isShared ? 'Shared ride' : 'Private ride'}
                </Text>
              </View>
              <View style={styles.metaPill}>
                <Text style={styles.metaPillText}>{tripStage.targetLabel}</Text>
              </View>
            </View>

            {tripStage.actionLabel && tripStage.nextStatus ? (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  isUpdatingRideStatus && styles.actionButtonDisabled,
                ]}
                onPress={() => {
                  const nextStatus = tripStage.nextStatus;
                  if (!nextStatus) return;
                  handleUpdateRideStatus(nextStatus);
                }}
                disabled={isUpdatingRideStatus}
              >
                <Text style={styles.actionButtonText}>
                  {isUpdatingRideStatus ? 'Updating Ride...' : tripStage.actionLabel}
                </Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={[
                styles.secondaryButton,
                isRefreshingRide && styles.secondaryButtonDisabled,
              ]}
              onPress={handleGetCurrentRide}
              disabled={isRefreshingRide}
            >
              <Text style={styles.secondaryButtonText}>
                {isRefreshingRide ? 'Refreshing Current Ride...' : 'Refresh Current Ride'}
              </Text>
            </TouchableOpacity>

            {currentRide.status !== 'PickedUp' ? (
              <TouchableOpacity
                style={[
                  styles.dangerButton,
                  isCancellingRide && styles.secondaryButtonDisabled,
                ]}
                onPress={() => setIsCancelModalOpen(true)}
                disabled={isCancellingRide}
              >
                <Text style={styles.dangerButtonText}>
                  {isCancellingRide ? 'Cancelling Ride...' : 'Cancel Ride'}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}

        {!currentRide ? (
          <View style={styles.card}>
            <View style={styles.cardTitleRow}>
              <View style={styles.cardTitleIconWrap}>
                <Text style={styles.cardTitleIcon}>M</Text>
              </View>
              <View style={styles.dispatchTitleWrap}>
                <Text style={styles.cardTitle}>Live Dispatch</Text>
                <Text style={styles.dispatchTitleSubtext}>
                  Map, priority ride, and nearby requests in one view
                </Text>
              </View>
            </View>

            {isOnline ? (
              <>
                <MapView
                  style={styles.map}
                  region={{
                    latitude: mapCenter.latitude,
                    longitude: mapCenter.longitude,
                    latitudeDelta: 0.08,
                    longitudeDelta: 0.08,
                  }}
                >
                  {currentCoords ? (
                    <Marker
                      coordinate={currentCoords}
                      title="You"
                      description="Your live location"
                      pinColor="blue"
                    />
                  ) : null}

                  {openRequestsWithCoords.map((ride) => (
                    <Marker
                      key={ride.id}
                      coordinate={{
                        latitude: ride.pickupLatitude as number,
                        longitude: ride.pickupLongitude as number,
                      }}
                      title={ride.pickupLocation}
                      description={ride.destination}
                      pinColor={selectedOpenRide?.id === ride.id ? 'green' : 'orange'}
                      onPress={() => setSelectedOpenRideId(ride.id)}
                      onCalloutPress={() => handleClaimOpenRideRequest(ride.id)}
                    />
                  ))}
                </MapView>

                {selectedOpenRide ? (
                  <View style={styles.mapPreviewCard}>
                    <View style={styles.priorityHeaderRow}>
                      <View>
                        <Text style={styles.mapPreviewTitle}>
                          {selectedRideIsClosest ? 'Closest ride now' : 'Selected ride'}
                        </Text>
                        <Text style={styles.prioritySubtitle}>
                          {selectedRideIsClosest
                            ? 'Best next pickup based on your current location'
                            : 'Tap other markers or cards to compare nearby requests'}
                        </Text>
                      </View>
                      {selectedRideIsClosest ? (
                        <View style={styles.priorityBadge}>
                          <Text style={styles.priorityBadgeText}>Priority</Text>
                        </View>
                      ) : null}
                    </View>

                    <Text style={styles.cardBodyValue}>{selectedOpenRide.pickupLocation}</Text>
                    <Text style={styles.detailText}>{selectedOpenRide.destination}</Text>
                    <View style={styles.rideInfoGrid}>
                      <View style={styles.rideInfoCell}>
                        <Text style={styles.rideInfoLabel}>Wait</Text>
                        <Text style={styles.rideInfoValue}>
                          {formatWait(getRideWaitMinutes(selectedOpenRide))}
                        </Text>
                      </View>
                      <View style={styles.rideInfoCell}>
                        <Text style={styles.rideInfoLabel}>Trip</Text>
                        <Text style={styles.rideInfoValue}>
                          {formatTripDuration(selectedRideTripEstimateMinutes)}
                        </Text>
                      </View>
                      <View style={styles.rideInfoCell}>
                        <Text style={styles.rideInfoLabel}>Pickup ETA</Text>
                        <Text style={styles.rideInfoValue}>
                          {selectedRidePickupEtaMinutes != null
                            ? `${selectedRidePickupEtaMinutes} min to pickup`
                            : 'Unavailable'}
                        </Text>
                      </View>
                      <View style={styles.rideInfoCell}>
                        <Text style={styles.rideInfoLabel}>Distance</Text>
                        <Text style={styles.rideInfoValue}>
                          {formatDistanceFromDriver(selectedOpenRide, currentCoords) ??
                            'Unavailable'}
                        </Text>
                      </View>
                    </View>

                    {incomingOffer?.id === selectedOpenRide.id &&
                    incomingOfferCountdownSeconds != null ? (
                      <Text style={styles.urgentCountdown}>
                        Offer expires in {incomingOfferCountdownSeconds}s
                      </Text>
                    ) : null}

                    <View style={styles.metaRow}>
                      <View style={styles.metaPill}>
                        <Text style={styles.metaPillText}>{selectedOpenRide.rideType}</Text>
                      </View>
                      <View style={styles.metaPill}>
                        <Text style={styles.metaPillText}>
                          {selectedOpenRide.isShared ? 'Shared ride' : 'Private ride'}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        (activeClaimRideId === selectedOpenRide.id || isOfferActionLoading) &&
                          styles.actionButtonDisabled,
                      ]}
                      onPress={() =>
                        incomingOffer?.id === selectedOpenRide.id
                          ? handleAcceptRide(incomingOffer.offerId)
                          : handleClaimOpenRideRequest(selectedOpenRide.id)
                      }
                      disabled={
                        activeClaimRideId === selectedOpenRide.id || isOfferActionLoading
                      }
                    >
                      <Text style={styles.actionButtonText}>
                        {incomingOffer?.id === selectedOpenRide.id
                          ? isOfferActionLoading
                            ? 'Accepting Request...'
                            : 'Accept Request'
                          : activeClaimRideId === selectedOpenRide.id
                            ? 'Claiming Ride...'
                            : selectedRideIsClosest
                              ? 'Claim Closest Ride'
                              : 'Claim This Ride'}
                      </Text>
                    </TouchableOpacity>

                    {incomingOffer?.id === selectedOpenRide.id ? (
                      <TouchableOpacity
                        style={[
                          styles.secondaryButton,
                          isOfferActionLoading && styles.secondaryButtonDisabled,
                        ]}
                        onPress={handleDeclineIncomingOffer}
                        disabled={isOfferActionLoading}
                      >
                        <Text style={styles.secondaryButtonText}>
                          {isOfferActionLoading ? 'Updating...' : 'Decline For Now'}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                ) : (
                  <View style={styles.mapPreviewCard}>
                    <Text style={styles.mapPreviewTitle}>Nearby map view</Text>
                    <Text style={styles.helperText}>
                      Tap a pickup marker to preview the ride and claim it quickly.
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[
                    styles.secondaryButton,
                    isRefreshingRequests && styles.secondaryButtonDisabled,
                  ]}
                  onPress={handleGetOpenRideRequests}
                  disabled={isRefreshingRequests}
                >
                  <Text style={styles.secondaryButtonText}>
                    {isRefreshingRequests
                      ? 'Refreshing Open Requests...'
                      : 'Refresh Open Requests'}
                  </Text>
                </TouchableOpacity>

                {relevantOpenRequests.length === 0 ? (
                  <View style={styles.emptyStateCard}>
                    <Text style={styles.emptyStateTitle}>No nearby requests right now</Text>
                    <Text style={styles.helperText}>
                      Stay online and keep this screen open. New passenger pickups will appear here.
                    </Text>
                  </View>
                ) : (
                  <>
                    <View style={styles.listHeaderRow}>
                      <Text style={styles.listHeaderTitle}>Available nearby rides</Text>
                      <Text style={styles.listHeaderCount}>
                        {relevantOpenRequests.length} visible
                      </Text>
                    </View>

                    {visibleRelevantRides.map((ride) => (
                      <TouchableOpacity
                        key={ride.id}
                        style={[
                          styles.innerCard,
                          styles.dispatchRideCard,
                          selectedOpenRide?.id === ride.id && styles.dispatchRideCardSelected,
                        ]}
                        onPress={() => setSelectedOpenRideId(ride.id)}
                        activeOpacity={0.9}
                      >
                        <View style={styles.dispatchRideHeaderRow}>
                          <View style={styles.dispatchRideTextWrap}>
                            <Text style={styles.cardBodyValue}>{ride.pickupLocation}</Text>
                            <Text style={styles.detailText}>{ride.destination}</Text>
                          </View>
                          {closestRelevantRide?.id === ride.id ? (
                            <View style={styles.closestBadge}>
                              <Text style={styles.closestBadgeText}>Closest</Text>
                            </View>
                          ) : null}
                        </View>

                        <View style={styles.rideMiniStatsRow}>
                          <View style={styles.rideMiniStat}>
                            <Text style={styles.rideMiniStatLabel}>Wait</Text>
                            <Text style={styles.rideMiniStatValue}>
                              {formatWait(getRideWaitMinutes(ride))}
                            </Text>
                          </View>
                          <View style={styles.rideMiniStat}>
                            <Text style={styles.rideMiniStatLabel}>Trip</Text>
                            <Text style={styles.rideMiniStatValue}>
                              {formatTripDuration(getEstimatedTripMinutesForRide(ride))}
                            </Text>
                          </View>
                        </View>

                        {formatDistanceFromDriver(ride, currentCoords) ? (
                          <Text style={styles.helperText}>
                            {formatDistanceFromDriver(ride, currentCoords)}
                          </Text>
                        ) : null}

                        <View style={styles.metaRow}>
                          <View style={styles.metaPill}>
                            <Text style={styles.metaPillText}>{ride.rideType}</Text>
                          </View>
                          <View style={styles.metaPill}>
                            <Text style={styles.metaPillText}>
                              {ride.isShared ? 'Shared ride' : 'Private ride'}
                            </Text>
                          </View>
                        </View>

                        <TouchableOpacity
                          style={[
                            styles.secondaryButton,
                            activeClaimRideId === ride.id && styles.secondaryButtonDisabled,
                          ]}
                          onPress={() => handleClaimOpenRideRequest(ride.id)}
                          disabled={activeClaimRideId === ride.id}
                        >
                          <Text style={styles.secondaryButtonText}>
                            {activeClaimRideId === ride.id
                              ? 'Claiming Ride...'
                              : closestRelevantRide?.id === ride.id
                                ? 'Claim Closest Ride'
                                : 'Claim This Ride'}
                          </Text>
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ))}

                    {relevantOpenRequests.length > 3 ? (
                      <TouchableOpacity
                        style={styles.showMoreButton}
                        onPress={() =>
                          setShowAllRelevantRides((currentValue) => !currentValue)
                        }
                      >
                        <Text style={styles.showMoreButtonText}>
                          {showAllRelevantRides
                            ? 'Show Only 3 Closest Rides'
                            : `Show ${relevantOpenRequests.length - 3} More Nearby Rides`}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </>
                )}
              </>
            ) : (
              <>
                <MapView
                  style={styles.map}
                  region={{
                    latitude: mapCenter.latitude,
                    longitude: mapCenter.longitude,
                    latitudeDelta: 0.08,
                    longitudeDelta: 0.08,
                  }}
                >
                  {currentCoords ? (
                    <Marker
                      coordinate={currentCoords}
                      title="You"
                      description="Your live location"
                      pinColor="blue"
                    />
                  ) : null}
                </MapView>

                <View style={styles.mapPreviewCard}>
                  <Text style={styles.mapPreviewTitle}>Map standby</Text>
                  <Text style={styles.helperText}>
                    Go online to see nearby requests appear around your current location.
                  </Text>
                </View>
              </>
            )}
          </View>
        ) : null}
      </ScrollView>

      <CancelRideModal
        visible={isCancelModalOpen}
        title="Cancel current ride?"
        subtitle="This returns the ride to dispatch so another driver can pick it up. Cancellation is only available before pickup."
        confirmLabel="Return ride to dispatch"
        reasons={[
          'Cannot reach passenger',
          'Vehicle issue',
          'Traffic or route issue',
          'Accepted by mistake',
        ]}
        allowNote
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={async (reason, note) => {
          const success = await handleCancelCurrentRide(reason, note);
          if (success) {
            setIsCancelModalOpen(false);
          }
        }}
        isSubmitting={isCancellingRide}
      />
    </View>
  );
}
