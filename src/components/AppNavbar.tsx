import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type AppNavbarProps = {
  fullName?: string;
  profileRoute?: '/(main)/passenger-profile' | string;
};

export default function AppNavbar({ fullName, profileRoute }: AppNavbarProps) {
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
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.brandRow}>
          <View style={styles.brandIconWrap}>
            <MaterialCommunityIcons name="taxi" size={18} color="#111827" />
          </View>

          <View style={styles.brandTextWrap}>
            <Text style={styles.title}>Taxi Manager</Text>
            <Text style={styles.subtitle}>Passenger dashboard</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.userBadge}
            activeOpacity={profileRoute ? 0.85 : 1}
            disabled={!profileRoute}
            onPress={() => {
              if (profileRoute) {
                router.push(profileRoute);
              }
            }}
          >
            <View style={styles.avatarWrap}>
              <MaterialCommunityIcons
                name="account-outline"
                size={16}
                color="#111827"
              />
            </View>

            <View style={styles.userMeta}>
              <Text style={styles.userLabel}>Account</Text>
              <Text style={styles.userText} numberOfLines={1}>
                {fullName || 'User'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={16} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#f3f4f6',
    paddingTop: 18,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  brandIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  brandTextWrap: {
    flexShrink: 1,
  },
  title: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 12,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 18,
    paddingVertical: 7,
    paddingHorizontal: 10,
    maxWidth: 160,
  },
  avatarWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  userMeta: {
    flexShrink: 1,
  },
  userLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: '#9ca3af',
    marginBottom: 1,
  },
  userText: {
    color: '#111827',
    maxWidth: 96,
    fontWeight: '700',
    fontSize: 13,
  },
  logoutButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
});
