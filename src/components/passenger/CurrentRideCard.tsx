import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { passengerStyles as styles } from '../../styles/passengerStyles';
import { CurrentRideType } from '../../types/passenger';

type CurrentRideCardProps = {
  currentRide: CurrentRideType | null;
  onRefreshRideStatus: () => void;
  onTrackRide?: () => void;
  isRefreshing?: boolean;
};

function getPassengerRideCopy(status?: string) {
  if (status === 'Pending') {
    return {
      title: 'Searching for a driver',
      subtitle:
        'We are still matching your trip. You will see driver details here as soon as someone accepts.',
    };
  }

  if (status === 'Accepted') {
    return {
      title: 'Driver assigned',
      subtitle:
        'A driver accepted your ride. Review their details below and open tracking for live updates.',
    };
  }

  if (status === 'OnTheWay') {
    return {
      title: 'Driver on the way',
      subtitle:
        'Your driver is heading to the pickup point now. Keep your phone nearby in case they need help finding you.',
    };
  }

  if (status === 'PickedUp') {
    return {
      title: 'Ride in progress',
      subtitle:
        'You are currently on the trip. Tracking stays available until you reach the destination.',
    };
  }

  if (status === 'Completed') {
    return {
      title: 'Ride completed',
      subtitle:
        'This trip is finished. If feedback is requested, you can rate the ride below on the main screen.',
    };
  }

  return {
    title: 'Current ride',
    subtitle: 'Your latest ride details are shown below.',
  };
}

export default function CurrentRideCard({
  currentRide,
  onRefreshRideStatus,
  onTrackRide,
  isRefreshing = false,
}: CurrentRideCardProps) {
  const rideCopy = getPassengerRideCopy(currentRide?.status);

  return (
    <View style={styles.card}>
      <View style={styles.cardTitleRow}>
        <View style={styles.cardTitleIconWrap}>
          <MaterialCommunityIcons name="steering" size={18} color="#111827" />
        </View>
        <Text style={styles.cardTitle}>Current Ride</Text>
      </View>

      {currentRide ? (
        <>
          <View style={styles.statusBanner}>
            <Text style={styles.statusTitle}>{rideCopy.title}</Text>
            <Text style={styles.helperText}>{rideCopy.subtitle}</Text>

            <Text style={styles.helperText}>
              Status: {currentRide.status || 'Unknown'}
            </Text>
          </View>

          {currentRide.driverId ? (
            <View style={styles.driverCard}>
              <Image
                source={{
                  uri:
                    currentRide.profileImageUrl ||
                    'https://via.placeholder.com/90',
                }}
                style={styles.driverImage}
              />

              <View style={styles.driverDetails}>
                <Text style={styles.driverCardTitle}>Your Driver</Text>
                <Text>
                  <Text style={styles.bold}>Name:</Text>{' '}
                  {currentRide.driverName || 'Not assigned yet'}
                </Text>
                <Text>
                  <Text style={styles.bold}>Car:</Text>{' '}
                  {currentRide.carModel || 'Not available'}
                </Text>
                <Text>
                  <Text style={styles.bold}>Driver Id:</Text>{' '}
                  {currentRide.driverId}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.helperText}>
              Driver details will appear here once a matching driver accepts the ride.
            </Text>
          )}

          <View style={styles.rideDetailsBox}>
            <Text>
              <Text style={styles.bold}>Ride Id:</Text> #{currentRide.id}
            </Text>
            <Text>
              <Text style={styles.bold}>Pickup:</Text> {currentRide.pickupLocation}
            </Text>
            <Text>
              <Text style={styles.bold}>Destination:</Text> {currentRide.destination}
            </Text>
            <Text>
              <Text style={styles.bold}>Ride Type:</Text> {currentRide.rideType}
            </Text>
            <Text>
              <Text style={styles.bold}>Shared:</Text>{' '}
              {currentRide.isShared ? 'Yes' : 'No'}
            </Text>
          </View>

          <View style={styles.orderButtonWrap}>
            <TouchableOpacity
              style={[
                styles.secondaryButton,
                isRefreshing && styles.secondaryButtonDisabled,
              ]}
              onPress={onRefreshRideStatus}
              disabled={isRefreshing}
            >
              <Text style={styles.secondaryButtonText}>
                {isRefreshing ? 'Refreshing...' : 'Refresh Ride Status'}
              </Text>
            </TouchableOpacity>
          </View>

          {currentRide.driverId && currentRide.status !== 'Completed' && onTrackRide ? (
            <View style={styles.orderButtonWrap}>
              <TouchableOpacity style={styles.primaryButton} onPress={onTrackRide}>
                <Text style={styles.primaryButtonText}>Track Driver</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </>
      ) : (
        <Text style={styles.helperText}>No current ride loaded yet.</Text>
      )}
    </View>
  );
}
