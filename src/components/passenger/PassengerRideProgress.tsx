import { Text, View } from 'react-native';
import { passengerStyles as styles } from '../../styles/passengerStyles';

type PassengerRideProgressProps = {
  status?: string;
};

function getProgressStep(status?: string) {
  if (status === 'Accepted' || status === 'OnTheWay' || status === 'PickedUp') {
    return 3;
  }

  if (status === 'Pending') {
    return 2;
  }

  return 1;
}

export default function PassengerRideProgress({
  status,
}: PassengerRideProgressProps) {
  const activeStep = getProgressStep(status);

  return (
    <View style={styles.passengerProgressWrap}>
      <View style={styles.passengerProgressRow}>
        <View style={styles.passengerProgressStep}>
          <View
            style={[
              styles.passengerProgressDot,
              activeStep >= 1 && styles.passengerProgressDotActive,
            ]}
          />
          <Text
            style={
              activeStep >= 1
                ? styles.passengerProgressLabelActive
                : styles.passengerProgressLabel
            }
          >
            Requested
          </Text>
        </View>

        <View
          style={[
            styles.passengerProgressDivider,
            activeStep >= 2 && styles.passengerProgressDividerActive,
          ]}
        />

        <View style={styles.passengerProgressStep}>
          <View
            style={[
              styles.passengerProgressDot,
              activeStep >= 2 && styles.passengerProgressDotActive,
            ]}
          />
          <Text
            style={
              activeStep >= 2
                ? styles.passengerProgressLabelActive
                : styles.passengerProgressLabel
            }
          >
            Matching
          </Text>
        </View>

        <View
          style={[
            styles.passengerProgressDivider,
            activeStep >= 3 && styles.passengerProgressDividerActive,
          ]}
        />

        <View style={styles.passengerProgressStep}>
          <View
            style={[
              styles.passengerProgressDot,
              activeStep >= 3 && styles.passengerProgressDotActive,
            ]}
          />
          <Text
            style={
              activeStep >= 3
                ? styles.passengerProgressLabelActive
                : styles.passengerProgressLabel
            }
          >
            Tracking
          </Text>
        </View>
      </View>

      <Text style={styles.passengerProgressCaption}>
        {activeStep === 1 && 'Your ride request was created successfully.'}
        {activeStep === 2 &&
          'We are matching your request with the best available driver.'}
        {activeStep === 3 &&
          'A driver is assigned. Follow the live trip updates on this screen.'}
      </Text>
    </View>
  );
}
