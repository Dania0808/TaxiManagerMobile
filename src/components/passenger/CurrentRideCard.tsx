import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { passengerStyles as styles } from '../../styles/passengerStyles';
import { CurrentRideType } from '../../types/passenger';
import PassengerRideProgress from './PassengerRideProgress';

type CurrentRideCardProps = {
  currentRide: CurrentRideType | null;
  onRefreshRideStatus: () => void;
  onCancelRide?: () => void;
  isRefreshing?: boolean;
  isCancelling?: boolean;
};

function getPassengerRideCopy(status?: string) {
  if (status === 'Pending') {
    return {
      title: 'Looking for a driver',
      subtitle: 'We are matching your trip with the best nearby driver.',
      badge: 'Matching',
    };
  }

  if (status === 'Accepted') {
    return {
      title: 'Driver assigned',
      subtitle: 'Your ride is confirmed and the driver details are ready below.',
      badge: 'Confirmed',
    };
  }

  if (status === 'OnTheWay') {
    return {
      title: 'Driver on the way',
      subtitle: 'Stay ready at pickup while the live map updates above.',
      badge: 'Arriving',
    };
  }

  if (status === 'PickedUp') {
    return {
      title: 'Ride in progress',
      subtitle: 'You are on the way now. The live map above follows the trip.',
      badge: 'On trip',
    };
  }

  if (status === 'Completed') {
    return {
      title: 'Ride completed',
      subtitle:
        'This trip is finished. If feedback is requested, you can rate the ride below on the main screen.',
      badge: 'Completed',
    };
  }

  return {
    title: 'Current ride',
    subtitle: 'Your latest ride details are shown below.',
    badge: 'Active ride',
  };
}

function getNextStepLabel(status?: string) {
  if (status === 'Pending') return 'We will update this card automatically';
  if (status === 'Accepted') return 'Review driver details and get ready for pickup';
  if (status === 'OnTheWay') return 'Watch the map and meet your driver';
  if (status === 'PickedUp') return 'Follow the route until arrival';
  if (status === 'Completed') return 'Leave feedback if requested';
  return 'Next: check the latest ride update';
}

export default function CurrentRideCard({
  currentRide,
  onRefreshRideStatus,
  onCancelRide,
  isRefreshing = false,
  isCancelling = false,
}: CurrentRideCardProps) {
  const rideCopy = getPassengerRideCopy(currentRide?.status);

  return (
    <View style={styles.liveRideCard}>
      <View style={styles.liveRideCardHeader}>
        <View style={styles.liveRideTitleWrap}>
          <View style={styles.liveRideEyebrowRow}>
            <View style={styles.liveRideEyebrowDot} />
            <Text style={styles.liveRideEyebrow}>Live ride</Text>
          </View>
          <Text style={styles.liveRideTitle}>{rideCopy.title}</Text>
          <Text style={styles.liveRideSubtitle}>{rideCopy.subtitle}</Text>
        </View>
        <View style={styles.liveRideStatusPill}>
          <Text style={styles.liveRideStatusPillText}>{rideCopy.badge}</Text>
        </View>
      </View>

      <PassengerRideProgress status={currentRide?.status} />

      {currentRide ? (
        <>
          <View style={styles.liveRideTripRow}>
            <View style={styles.liveRideRouteColumn}>
              <View style={styles.liveRideRouteNodeWrap}>
                <View style={[styles.liveRideRouteNode, styles.liveRideRouteNodePickup]} />
                <View style={styles.liveRideRouteTextWrap}>
                  <Text style={styles.liveRideRouteLabel}>Pickup</Text>
                  <Text style={styles.liveRideRouteValue} numberOfLines={1}>
                    {currentRide.pickupLocation}
                  </Text>
                </View>
              </View>

              <View style={styles.liveRideRouteLine} />

              <View style={styles.liveRideRouteNodeWrap}>
                <View style={[styles.liveRideRouteNode, styles.liveRideRouteNodeDestination]} />
                <View style={styles.liveRideRouteTextWrap}>
                  <Text style={styles.liveRideRouteLabel}>Destination</Text>
                  <Text style={styles.liveRideRouteValue} numberOfLines={1}>
                    {currentRide.destination}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.liveRideMiniMetaCard}>
              <Text style={styles.liveRideMiniMetaLabel}>Ride</Text>
              <Text style={styles.liveRideMiniMetaValue}>#{currentRide.id}</Text>
              <Text style={styles.liveRideMiniMetaSecondary}>{currentRide.rideType}</Text>
              <Text style={styles.liveRideMiniMetaSecondary}>
                {currentRide.isShared ? 'Shared' : 'Private'}
              </Text>
            </View>
          </View>

          {currentRide.driverId ? (
            <View style={styles.liveRideDriverRow}>
              <Image
                source={{
                  uri: currentRide.profileImageUrl || 'https://via.placeholder.com/90',
                }}
                style={styles.liveRideDriverImage}
              />

              <View style={styles.liveRideDriverTextWrap}>
                <Text style={styles.liveRideDriverName}>
                  {currentRide.driverName || 'Driver assigned'}
                </Text>
                <Text style={styles.liveRideDriverMeta}>
                  {currentRide.carModel || 'Vehicle details coming soon'}
                </Text>
                <Text style={styles.liveRideDriverHint}>
                  {getNextStepLabel(currentRide.status)}
                </Text>
              </View>

              <View style={styles.liveRideDriverBadge}>
                <MaterialCommunityIcons name="steering" size={18} color="#111827" />
              </View>
            </View>
          ) : (
            <View style={styles.liveRideSoftBanner}>
              <Text style={styles.liveRideSoftBannerText}>
                Driver details will appear here as soon as someone accepts your ride.
              </Text>
            </View>
          )}

          <View style={styles.liveRideBottomRow}>
            <View style={styles.liveRideFooterPill}>
              <Text style={styles.liveRideFooterPillText}>
                Status: {currentRide.status || 'Unknown'}
              </Text>
            </View>
          </View>

          <View style={styles.liveRideActionsRow}>
            <TouchableOpacity
              style={[
                styles.liveRideRefreshButton,
                isRefreshing && styles.secondaryButtonDisabled,
              ]}
              onPress={onRefreshRideStatus}
              disabled={isRefreshing}
            >
              <MaterialCommunityIcons name="refresh" size={16} color="#111827" />
              <Text style={styles.liveRideRefreshButtonText}>
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Text>
            </TouchableOpacity>

            {onCancelRide ? (
              <TouchableOpacity
                style={[
                  styles.liveRideCancelButton,
                  isCancelling && styles.secondaryButtonDisabled,
                ]}
                onPress={onCancelRide}
                disabled={isCancelling}
              >
                <MaterialCommunityIcons name="close-circle-outline" size={16} color="#991b1b" />
                <Text style={styles.liveRideCancelButtonText}>
                  {isCancelling ? 'Cancelling...' : 'Cancel ride'}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </>
      ) : (
        <View style={styles.liveRideSoftBanner}>
          <Text style={styles.liveRideSoftBannerText}>No current ride loaded yet.</Text>
        </View>
      )}
    </View>
  );
}
