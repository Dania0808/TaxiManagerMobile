import { Text, View } from 'react-native';
import { passengerStyles as styles } from '../../styles/passengerStyles';

type PassengerHeaderProps = {
  coinBalance: number;
};

export default function PassengerHeader({ coinBalance }: PassengerHeaderProps) {
  return (
    <View style={styles.headerRow}>
      <View style={styles.headerTextWrap}>
        <Text style={styles.title}>Passenger Dashboard</Text>
        <Text style={styles.subtitle}>
          Enter your pickup and destination, then confirm your ride.
        </Text>
      </View>

      <View style={styles.coinsBadge}>
        <Text style={styles.coinsEmoji}>🪙</Text>
        <Text style={styles.coinsLabel}>Coins</Text>
        <Text style={styles.coinsValue}>{coinBalance} ₪</Text>
      </View>
    </View>
  );
}