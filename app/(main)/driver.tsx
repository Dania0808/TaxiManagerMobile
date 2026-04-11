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
import { useDriverScreen } from '../../src/hooks/useDriverScreen';
import { AvailableRideType } from '../../src/types/driver';
import { driverStyles as styles } from '../../src/styles/driverStyles';

const RELEVANT_RIDE_RADIUS_KM = 15;

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
  const {
    user,
    loadingUser,
    notLoggedIn,
    isOnline,
    driverScreenState,
    openRideRequests,
    incomingOffer,
    currentRide,
    trackingSnapshot,
    currentCoords,
    locationError,
    message,
    navigationTarget,
    activeRideWaitMinutes,
    incomingOfferWaitMinutes,
    incomingOfferCountdownSeconds,
    estimatedTripDurationMinutes,
    defaultCoords,
    handleAcceptRide,
    handleClaimOpenRideRequest,
    handleDeclineIncomingOffer,
    handleToggleOnlineStatus,
    handleGetOpenRideRequests,
    handleGetCurrentRide,
    handleUpdateRideStatus,
    handleRefreshTracking,
    handleOpenExternalNavigation,
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

  return (
    <View style={styles.screen}>
      <AppNavbar
        fullName={user?.fullName}
        profileRoute="/(main)/driver-profile"
        profileImageStorageKey={
          user?.driverId ? `driver_profile_image_url_${user.driverId}` : undefined
        }
        subtitle="Driver dashboard"
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroIdentityRow}>
              <View style={styles.heroIconWrap}>
                <Text style={styles.heroIcon}>D</Text>
              </View>

              <View style={styles.heroTextWrap}>
                <Text style={styles.sectionTitle}>Driver Dispatch</Text>
                <Text style={styles.heroSubtitle}>{stateTitle}</Text>
              </View>
            </View>

            <View style={styles.availabilityWrap}>
              <Text style={styles.availabilityLabel}>
                {isOnline ? 'Online' : 'Offline'}
              </Text>
              <Switch value={isOnline} onValueChange={handleToggleOnlineStatus} />
            </View>
          </View>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatPill}>
              <Text style={styles.heroStatLabel}>Open Requests</Text>
              <Text style={styles.heroStatValue}>{relevantOpenRequests.length}</Text>
            </View>
          </View>
        </View>

        {message ? <Text style={styles.message}>{message}</Text> : null}
        {locationError ? <Text style={styles.message}>{locationError}</Text> : null}

        {!currentRide && isOnline ? (
          <View style={styles.card}>
            <View style={styles.cardTitleRow}>
              <View style={styles.cardTitleIconWrap}>
                <Text style={styles.cardTitleIcon}>I</Text>
              </View>
              <Text style={styles.cardTitle}>Closest Pickup Ride</Text>
            </View>

            {closestRelevantRide ? (
              <>
                <View style={styles.urgentBanner}>
                  <Text style={styles.urgentTitle}>
                    {formatWait(getRideWaitMinutes(closestRelevantRide))}
                  </Text>
                  <Text style={styles.helperText}>
                    {formatTripDuration(closestRelevantRide.estimatedTripDurationMinutes)}
                  </Text>
                  <Text style={styles.helperText}>
                    {closestRelevantRide.estimatedPickupMinutes != null
                      ? `${closestRelevantRide.estimatedPickupMinutes} min to pickup`
                      : 'Pickup ETA will appear when available'}
                  </Text>
                  {incomingOffer?.id === closestRelevantRide.id &&
                  incomingOfferCountdownSeconds != null ? (
                    <Text style={styles.helperText}>
                      Offer expires in {incomingOfferCountdownSeconds}s
                    </Text>
                  ) : null}
                </View>

                <View style={styles.innerCard}>
                  <Text style={styles.cardBodyTitle}>Pickup</Text>
                  <Text style={styles.cardBodyValue}>{closestRelevantRide.pickupLocation}</Text>
                  <Text style={styles.cardBodyTitle}>Destination</Text>
                  <Text style={styles.cardBodyValue}>{closestRelevantRide.destination}</Text>

                  <View style={styles.metaRow}>
                    <View style={styles.metaPill}>
                      <Text style={styles.metaPillText}>{closestRelevantRide.rideType}</Text>
                    </View>
                    <View style={styles.metaPill}>
                      <Text style={styles.metaPillText}>
                        {closestRelevantRide.isShared ? 'Shared ride' : 'Private ride'}
                      </Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() =>
                    incomingOffer?.id === closestRelevantRide.id
                      ? handleAcceptRide(incomingOffer.offerId)
                      : handleClaimOpenRideRequest(closestRelevantRide.id)
                  }
                >
                  <Text style={styles.actionButtonText}>
                    {incomingOffer?.id === closestRelevantRide.id
                      ? 'Accept Request'
                      : 'Claim Closest Ride'}
                  </Text>
                </TouchableOpacity>

                {incomingOffer?.id === closestRelevantRide.id ? (
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handleDeclineIncomingOffer}
                  >
                    <Text style={styles.secondaryButtonText}>Decline For Now</Text>
                  </TouchableOpacity>
                ) : null}
              </>
            ) : (
              <View style={styles.emptyStateCard}>
                <Text style={styles.emptyStateTitle}>Waiting for the next nearby request</Text>
                <Text style={styles.helperText}>
                  Stay online and we will surface the closest nearby pickup here.
                </Text>
              </View>
            )}
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
                {formatTripDuration(estimatedTripDurationMinutes)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleOpenExternalNavigation}
            >
              <Text style={styles.actionButtonText}>Open Turn-by-Turn Navigation</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleRefreshTracking}
            >
              <Text style={styles.secondaryButtonText}>Refresh Live Data</Text>
            </TouchableOpacity>
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
                  {formatTripDuration(estimatedTripDurationMinutes)}
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
                style={styles.actionButton}
                onPress={() => {
                  const nextStatus = tripStage.nextStatus;
                  if (!nextStatus) return;
                  handleUpdateRideStatus(nextStatus);
                }}
              >
                <Text style={styles.actionButtonText}>{tripStage.actionLabel}</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleGetCurrentRide}
            >
              <Text style={styles.secondaryButtonText}>Refresh Current Ride</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {!currentRide ? (
          <View style={styles.card}>
            <View style={styles.cardTitleRow}>
              <View style={styles.cardTitleIconWrap}>
                <Text style={styles.cardTitleIcon}>M</Text>
              </View>
              <Text style={styles.cardTitle}>Open Requests Map</Text>
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
                    <Text style={styles.mapPreviewTitle}>Selected Pickup</Text>
                    <Text style={styles.cardBodyValue}>{selectedOpenRide.pickupLocation}</Text>
                    <Text style={styles.detailText}>{selectedOpenRide.destination}</Text>
                    <Text style={styles.helperText}>
                      {formatWait(getRideWaitMinutes(selectedOpenRide))}
                    </Text>
                    <Text style={styles.helperText}>
                      {formatTripDuration(selectedOpenRide.estimatedTripDurationMinutes)}
                    </Text>

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
                      style={styles.actionButton}
                      onPress={() => handleClaimOpenRideRequest(selectedOpenRide.id)}
                    >
                      <Text style={styles.actionButtonText}>Claim This Ride</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={handleGetOpenRideRequests}
                >
                  <Text style={styles.secondaryButtonText}>Refresh Open Requests</Text>
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
                    {visibleRelevantRides.map((ride) => (
                      <View key={ride.id} style={styles.innerCard}>
                        <Text style={styles.cardBodyValue}>{ride.pickupLocation}</Text>
                        <Text style={styles.detailText}>{ride.destination}</Text>
                        <Text style={styles.helperText}>
                          {formatWait(getRideWaitMinutes(ride))}
                        </Text>
                        <Text style={styles.helperText}>
                          {formatTripDuration(ride.estimatedTripDurationMinutes)}
                        </Text>

                        <TouchableOpacity
                          style={styles.secondaryButton}
                          onPress={() => handleClaimOpenRideRequest(ride.id)}
                        >
                          <Text style={styles.secondaryButtonText}>Claim This Ride</Text>
                        </TouchableOpacity>
                      </View>
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
              <View style={styles.emptyStateCard}>
                <Text style={styles.emptyStateTitle}>You are offline</Text>
                <Text style={styles.helperText}>
                  Go online to receive nearby requests and browse open passenger pickups.
                </Text>
              </View>
            )}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
