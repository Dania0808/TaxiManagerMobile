import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type AppNavbarProps = {
  fullName?: string;
};

export default function AppNavbar({ fullName }: AppNavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');

      Alert.alert('Logged out', 'You have been logged out successfully.');
      router.replace('/(auth)');
    } catch (error) {
      console.log('LOGOUT ERROR:', error);
      Alert.alert('Error', 'Failed to logout.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Taxi Manager</Text>

      <View style={styles.rightSection}>
        <Text style={styles.userText}>{fullName || 'User'}</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1976d2',
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userText: {
    color: 'white',
    marginRight: 12,
    maxWidth: 120,
  },
  logoutButton: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  logoutButtonText: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
});