import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { removePushNotificationsAsync } from '../services/notificationService';

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
  const insets = useSafeAreaInsets();
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
            await removePushNotificationsAsync();
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('token');
            setIsDrawerOpen(false);
            router.replace('/(auth)');
          } catch (error) {
            console.log('LOGOUT ERROR:', error);
            Alert.alert('Error', 'Failed to logout.');
          }
        },
      },
    ]);
  };

  const handleOpenProfile = () => {
    if (!profileRoute) return;
    setIsDrawerOpen(false);
    router.push(profileRoute);
  };

  return (
    <>
      <SafeAreaView style={styles.wrapper} edges={['top']}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setIsDrawerOpen(true)}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name="menu" size={22} color="#111827" />
          </TouchableOpacity>

          <View style={styles.titleWrap}>
            <Text style={styles.title}>Taxi Manager</Text>
          </View>

          {profileImageUrl ? (
            <Image source={{ uri: profileImageUrl }} style={styles.headerAvatar} />
          ) : (
            <View style={styles.headerAccent}>
              <MaterialCommunityIcons name="account-outline" size={18} color="#111827" />
            </View>
          )}
        </View>
      </SafeAreaView>

      <Modal
        visible={isDrawerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDrawerOpen(false)}
      >
        <View style={styles.drawerRoot}>
          <Pressable style={styles.drawerBackdrop} onPress={() => setIsDrawerOpen(false)} />

          <View style={[styles.drawerPanel, { paddingTop: Math.max(insets.top, 18) + 8 }]}>
            <View style={styles.drawerHandle} />

            <View style={styles.drawerProfileCard}>
              {profileImageUrl ? (
                <Image source={{ uri: profileImageUrl }} style={styles.drawerAvatar} />
              ) : (
                <View style={styles.drawerAvatarFallback}>
                  <MaterialCommunityIcons name="account-outline" size={22} color="#111827" />
                </View>
              )}

              <View style={styles.drawerProfileTextWrap}>
                <Text style={styles.drawerName} numberOfLines={1}>
                  {fullName || 'User'}
                </Text>
                <Text style={styles.drawerRole}>Account</Text>
              </View>
            </View>

            {typeof coinBalance === 'number' ? (
              <View style={styles.drawerCoinsCard}>
                <View style={styles.drawerCoinsIconWrap}>
                  <MaterialCommunityIcons
                    name="star-four-points-circle-outline"
                    size={18}
                    color="#92400e"
                  />
                </View>
                <View>
                  <Text style={styles.drawerCoinsLabel}>Coins</Text>
                  <Text style={styles.drawerCoinsValue}>{coinBalance}</Text>
                </View>
              </View>
            ) : null}

            <View style={styles.drawerActions}>
              <TouchableOpacity
                style={styles.drawerActionButton}
                onPress={handleOpenProfile}
                disabled={!profileRoute}
                activeOpacity={0.85}
              >
                <View style={styles.drawerActionIconWrap}>
                  <MaterialCommunityIcons
                    name="account-cog-outline"
                    size={18}
                    color="#111827"
                  />
                </View>
                <View style={styles.drawerActionTextWrap}>
                  <Text style={styles.drawerActionTitle}>Profile</Text>
                  <Text style={styles.drawerActionSubtitle}>View and update your account</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerActionButton}
                onPress={handleLogout}
                activeOpacity={0.85}
              >
                <View style={styles.drawerActionIconWrap}>
                  <MaterialCommunityIcons name="logout" size={18} color="#7f1d1d" />
                </View>
                <View style={styles.drawerActionTextWrap}>
                  <Text style={styles.drawerActionTitle}>Log out</Text>
                  <Text style={styles.drawerActionSubtitle}>End the current session</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#f8f7f3',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingRight: 2,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  titleWrap: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
  },
  headerAccent: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#fde68a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fcd34d',
    marginRight: 2,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#fcd34d',
    marginRight: 2,
  },
  drawerRoot: {
    flex: 1,
    flexDirection: 'row',
  },
  drawerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.28)',
  },
  drawerPanel: {
    width: 312,
    backgroundColor: '#fffdf8',
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderLeftWidth: 1,
    borderLeftColor: '#efe4bf',
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: -6, height: 0 },
    elevation: 10,
  },
  drawerHandle: {
    width: 40,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#d1d5db',
    alignSelf: 'center',
    marginBottom: 18,
  },
  drawerProfileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 14,
    marginBottom: 14,
    gap: 12,
  },
  drawerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  drawerAvatarFallback: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fde68a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerProfileTextWrap: {
    flex: 1,
  },
  drawerName: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 3,
  },
  drawerRole: {
    color: '#6b7280',
    fontSize: 12,
  },
  drawerCoinsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fcd34d',
    backgroundColor: '#fef3c7',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  drawerCoinsIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fffdf5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerCoinsLabel: {
    color: '#92400e',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  drawerCoinsValue: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
  },
  drawerActions: {
    gap: 10,
  },
  drawerActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    padding: 14,
  },
  drawerActionIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerActionTextWrap: {
    flex: 1,
  },
  drawerActionTitle: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  drawerActionSubtitle: {
    color: '#6b7280',
    fontSize: 12,
    lineHeight: 17,
  },
});
