import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppNavbar from '../../src/components/AppNavbar';
import { getNotificationHistory } from '../../src/services/notificationHistoryService';
import { NotificationHistoryItem } from '../../src/types/notification';

type NotificationUser = {
  fullName?: string;
  role?: string;
  coinBalance?: number;
  passengerId?: number;
  driverId?: number;
};

function formatNotificationTime(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return 'Unknown time';
  }

  return parsed.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getHomeRoute(role?: string) {
  if (role === 'Driver') return '/(main)/driver';
  if (role === 'AIManager') return '/(main)/ai';
  return '/(main)/passenger';
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [user, setUser] = useState<NotificationUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [notifications, setNotifications] = useState<NotificationHistoryItem[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadNotifications = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setLoadingNotifications(true);
    }

    try {
      const history = await getNotificationHistory();
      setNotifications(history);
      setError('');
    } catch (loadError: any) {
      console.log('NOTIFICATION HISTORY ERROR:', loadError?.response?.data || loadError?.message);
      setError('Failed to load notification history.');
    } finally {
      setLoadingNotifications(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (loadError) {
        console.log('LOAD USER ERROR:', loadError);
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (!loadingUser && user) {
      loadNotifications();
    } else if (!loadingUser) {
      setLoadingNotifications(false);
    }
  }, [loadingUser, user]);

  if (!loadingUser && !user) {
    return <Redirect href="/(auth)" />;
  }

  if (loadingUser) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <AppNavbar
        fullName={user?.fullName}
        profileRoute={
          user?.role === 'Driver'
            ? '/(main)/driver-profile'
            : user?.role === 'AIManager'
              ? undefined
              : '/(main)/passenger-profile'
        }
        notificationsRoute="/(main)/notifications"
        coinBalance={user?.role === 'Passenger' ? user?.coinBalance : undefined}
        profileImageStorageKey={
          user?.role === 'Driver'
            ? user?.driverId
              ? `driver_profile_image_url_${user.driverId}`
              : undefined
            : user?.role === 'Passenger'
              ? user?.passengerId
                ? `passenger_profile_image_url_${user.passengerId}`
                : undefined
              : undefined
        }
        subtitle="Recent alerts"
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadNotifications(true)}
            tintColor="#111827"
          />
        }
      >
        <View style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>Notifications</Text>
          <Text style={styles.heroTitle}>Recent ride activity</Text>
          <Text style={styles.heroSubtitle}>
            Review the latest ride updates, assignment alerts, cancellations, and status changes.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.replace(getHomeRoute(user?.role))}
        >
          <Text style={styles.homeButtonText}>Back To Home</Text>
        </TouchableOpacity>

        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Could not load alerts</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {loadingNotifications ? (
          <View style={styles.centerCard}>
            <ActivityIndicator size="small" color="#111827" />
            <Text style={styles.helperText}>Loading your recent notifications...</Text>
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptyText}>
              Once rides are assigned, updated, cancelled, or completed, the alerts will appear here.
            </Text>
          </View>
        ) : (
          notifications.map((item) => (
            <View key={item.id} style={styles.notificationCard}>
              <View style={styles.notificationHeader}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationTime}>
                  {formatNotificationTime(item.createdAtUtc)}
                </Text>
              </View>

              <Text style={styles.notificationBody}>{item.body}</Text>

              <View style={styles.metaRow}>
                {item.event ? (
                  <View style={styles.metaPill}>
                    <Text style={styles.metaPillText}>{item.event}</Text>
                  </View>
                ) : null}

                {item.target ? (
                  <View style={styles.metaPill}>
                    <Text style={styles.metaPillText}>{item.target}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8f7f3',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 36,
    gap: 12,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f7f3',
    padding: 24,
  },
  loadingText: {
    marginTop: 10,
    color: '#4b5563',
    fontSize: 15,
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  heroEyebrow: {
    color: '#a16207',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  heroTitle: {
    color: '#111827',
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 21,
  },
  homeButton: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingVertical: 14,
  },
  homeButtonText: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '800',
  },
  errorCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#fecaca',
    backgroundColor: '#fff7f7',
    padding: 16,
  },
  errorTitle: {
    color: '#991b1b',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 6,
  },
  errorText: {
    color: '#7f1d1d',
    fontSize: 13,
    lineHeight: 19,
  },
  centerCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  helperText: {
    color: '#6b7280',
    fontSize: 13,
    textAlign: 'center',
  },
  emptyCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    padding: 22,
  },
  emptyTitle: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 21,
  },
  notificationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  notificationHeader: {
    gap: 6,
    marginBottom: 8,
  },
  notificationTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
  },
  notificationTime: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '600',
  },
  notificationBody: {
    color: '#374151',
    fontSize: 14,
    lineHeight: 21,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  metaPill: {
    borderRadius: 999,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  metaPillText: {
    color: '#4b5563',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
