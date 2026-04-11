import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type AppNavbarProps = {
  fullName?: string;
  profileRoute?: Href;
  coinBalance?: number;
  profileImageStorageKey?: string;
  subtitle?: string;
};

export default function AppNavbar({
  fullName,
  profileRoute,
  coinBalance,
  profileImageStorageKey,
  subtitle = 'Passenger dashboard',
}: AppNavbarProps) {
  const router = useRouter();
  const [profileImageUrl, setProfileImageUrl] = useState('');

  useEffect(() => {
    const loadProfileImage = async () => {
      if (!profileImageStorageKey) {
        setProfileImageUrl('');
        return;
      }

      const savedImage = await AsyncStorage.getItem(profileImageStorageKey);
      setProfileImageUrl(savedImage || '');
    };

    loadProfileImage();
  }, [profileImageStorageKey]);

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
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          {typeof coinBalance === 'number' ? (
            <View style={styles.coinsPill}>
              <MaterialCommunityIcons name="cash-multiple" size={16} color="#111827" />
              <View>
                <Text style={styles.pillLabel}>Coins</Text>
                <Text style={styles.pillValue}>{coinBalance}</Text>
              </View>
            </View>
          ) : null}

          <TouchableOpacity
            style={styles.profileButton}
            activeOpacity={profileRoute ? 0.85 : 1}
            disabled={!profileRoute}
            onPress={() => {
              if (profileRoute) {
                router.push(profileRoute);
              }
            }}
          >
            {profileImageUrl ? (
              <Image source={{ uri: profileImageUrl }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarWrap}>
                <MaterialCommunityIcons
                  name="account-outline"
                  size={16}
                  color="#111827"
                />
              </View>
            )}

            <View style={styles.userMeta}>
              <Text style={styles.userLabel}>Profile</Text>
              <Text style={styles.userText} numberOfLines={1}>
                {fullName || 'User'}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={18} color="#9ca3af" />
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
  coinsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 18,
    paddingVertical: 7,
    paddingHorizontal: 10,
    gap: 8,
  },
  pillLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: '#9ca3af',
    marginBottom: 1,
  },
  pillValue: {
    color: '#111827',
    fontWeight: '800',
    fontSize: 13,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 18,
    paddingVertical: 7,
    paddingHorizontal: 10,
    maxWidth: 176,
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
  avatarImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  userMeta: {
    flexShrink: 1,
    marginRight: 4,
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
