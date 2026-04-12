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
    Alert.alert('Log out', 'Are you sure you want to end your current session?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('token');

            router.replace('/(auth)');
          } catch (error) {
            console.log('LOGOUT ERROR:', error);
            Alert.alert('Error', 'Failed to logout.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <View style={styles.brandRow}>
            <View style={styles.brandIconWrap}>
              <MaterialCommunityIcons name="taxi" size={18} color="#111827" />
            </View>

            <View style={styles.brandTextWrap}>
              <Text style={styles.title}>Taxi Manager</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
          </View>

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
              <Image source={{ uri: profileImageUrl }} style={styles.profileAvatar} />
            ) : (
              <View style={styles.profileAvatarFallback}>
                <MaterialCommunityIcons
                  name="account-outline"
                  size={16}
                  color="#111827"
                />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.identityBlock}>
            <Text style={styles.identityLabel}>Signed in as</Text>
            <Text style={styles.identityName} numberOfLines={1}>
              {fullName || 'User'}
            </Text>
          </View>

          <View style={styles.actionsRow}>
            {typeof coinBalance === 'number' ? (
              <View style={styles.coinsPill}>
                <View style={styles.coinsIconWrap}>
                  <MaterialCommunityIcons name="cash-multiple" size={15} color="#111827" />
                </View>
                <View>
                  <Text style={styles.pillLabel}>Coins</Text>
                  <Text style={styles.pillValue}>{coinBalance}</Text>
                </View>
              </View>
            ) : null}

            <TouchableOpacity
              style={styles.profileMetaButton}
              activeOpacity={profileRoute ? 0.85 : 1}
              disabled={!profileRoute}
              onPress={() => {
                if (profileRoute) {
                  router.push(profileRoute);
                }
              }}
            >
              <Text style={styles.profileMetaText}>Profile</Text>
              <MaterialCommunityIcons name="chevron-right" size={16} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <MaterialCommunityIcons name="logout" size={16} color="#111827" />
            </TouchableOpacity>
          </View>
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
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  brandIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#facc15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
    marginTop: 3,
  },
  profileButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  profileAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  profileAvatarFallback: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#facc15',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  identityBlock: {
    flex: 1,
    minWidth: 120,
    marginRight: 10,
  },
  identityLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: '#9ca3af',
    marginBottom: 4,
  },
  identityName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 8,
  },
  coinsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 8,
  },
  coinsIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
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
  profileMetaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  profileMetaText: {
    color: '#111827',
    fontWeight: '700',
    fontSize: 13,
    marginRight: 4,
  },
  logoutButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
});
