import { Button, Image, Text, View } from 'react-native';
import { passengerStyles as styles } from '../../styles/passengerStyles';
import { CurrentRideType } from '../../types/passenger';

type CurrentRideCardProps = {
  currentRide: CurrentRideType | null;
  onRefreshRideStatus: () => void;
  onTrackRide?: () => void;
};

export default function CurrentRideCard({
  currentRide,
  onRefreshRideStatus,
  onTrackRide,
}: CurrentRideCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Current Ride</Text>

      {currentRide ? (
        <>
          <View style={styles.statusBanner}>
            <Text style={styles.statusTitle}>
              {currentRide.status === 'Pending' && 'Looking for a driver for you...'}
              {currentRide.status === 'Accepted' && 'A driver accepted your ride.'}
              {currentRide.status === 'OnTheWay' && 'Driver is on the way.'}
              {currentRide.status === 'PickedUp' && 'You are currently on the ride.'}
              {currentRide.status === 'Completed' && 'Ride completed.'}
            </Text>

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
              <Text style={styles.bold}>Ride Id:</Text> {currentRide.id}
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
            <Button title="Refresh Ride Status" onPress={onRefreshRideStatus} />
          </View>

          {currentRide.driverId && currentRide.status !== 'Completed' && onTrackRide ? (
            <View style={styles.orderButtonWrap}>
              <Button title="Track Driver" onPress={onTrackRide} />
            </View>
          ) : null}
        </>
      ) : (
        <Text style={styles.helperText}>No current ride loaded yet.</Text>
      )}
    </View>
  );
}
