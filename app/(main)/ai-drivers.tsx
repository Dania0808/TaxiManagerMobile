import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AppNavbar from '../../src/components/AppNavbar';
import { getAiAllDrivers } from '../../src/services/aiManagerService';
import { AiDriverDirectoryItemType, AiManagerStoredUser } from '../../src/types/aiManager';

function formatScore(value: number | null | undefined) {
  if (value == null) return 'Score unavailable';
  return `${value.toFixed(1)} score`;
}

function formatRating(value: number | null | undefined) {
  if (value == null) return 'Rating unavailable';
  return `${value.toFixed(1)} avg rating`;
}

export default function AiDriversScreen() {
  const router = useRouter();
  const [user, setUser] = useState<AiManagerStoredUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const [drivers, setDrivers] = useState<AiDriverDirectoryItemType[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoadingUser(true);
        const storedUser = await AsyncStorage.getItem('user');

        if (!storedUser) {
          setNotLoggedIn(true);
          return;
        }

        const parsedUser: AiManagerStoredUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.log('LOAD AI DRIVERS USER ERROR:', error);
        setNotLoggedIn(true);
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const loadDrivers = async () => {
      try {
        setIsRefreshing(true);
        const data = await getAiAllDrivers();
        setDrivers(data);
        setMessage('');
      } catch (error: any) {
        console.log('AI ALL DRIVERS ERROR:', error?.response?.data || error?.message);
        setMessage(
          error?.response?.data ||
            'Failed to load all drivers. Make sure the backend supports GET /Drivers.'
        );
      } finally {
        setIsRefreshing(false);
      }
    };

    loadDrivers();
  }, []);

  const filteredDrivers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return drivers;
    }

    return drivers.filter((driver) => {
      const name = (driver.driverName || driver.fullName || '').toLowerCase();
      const vehicle = (driver.carType || driver.carModel || '').toLowerCase();
      const plate = (driver.vehiclePlateNumber || '').toLowerCase();
      return (
        name.includes(normalizedQuery) ||
        vehicle.includes(normalizedQuery) ||
        plate.includes(normalizedQuery)
      );
    });
  }, [drivers, searchQuery]);

  if (notLoggedIn) {
    return <Redirect href="/(auth)" />;
  }

  if (loadingUser) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading drivers directory...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <AppNavbar fullName={user?.fullName} subtitle="AI drivers directory" />

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/(main)/ai')}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="arrow-left" size={18} color="#111827" />
          <Text style={styles.backButtonText}>Back to AI Dashboard</Text>
        </TouchableOpacity>

        <View style={styles.heroCard}>
          <Text style={styles.title}>All Drivers</Text>
          <Text style={styles.subtitle}>
            Browse every driver in the app with profile photo, car type, and score details.
          </Text>

          <View style={styles.heroMetaRow}>
            <View style={styles.heroPill}>
              <Text style={styles.heroPillLabel}>Drivers loaded</Text>
              <Text style={styles.heroPillValue}>{drivers.length}</Text>
            </View>

            <View style={styles.heroPill}>
              <Text style={styles.heroPillLabel}>Showing</Text>
              <Text style={styles.heroPillValue}>{filteredDrivers.length}</Text>
            </View>
          </View>

          <TextInput
            placeholder="Search by name, car type, or plate"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.input}
          />
        </View>

        {message ? (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>{message}</Text>
          </View>
        ) : null}

        {isRefreshing ? (
          <View style={styles.centeredCard}>
            <ActivityIndicator size="small" />
            <Text style={styles.helperText}>Refreshing drivers...</Text>
          </View>
        ) : null}

        {!isRefreshing && filteredDrivers.length === 0 ? (
          <View style={styles.emptyStateCard}>
            <Text style={styles.emptyStateTitle}>No drivers matched your search</Text>
            <Text style={styles.helperText}>
              Try a different name, vehicle type, or plate number.
            </Text>
          </View>
        ) : null}

        {filteredDrivers.map((driver, index) => {
          const imageUrl = driver.profileImageUrl || 'https://via.placeholder.com/160';
          const displayName =
            driver.driverName || driver.fullName || `Driver #${driver.driverId ?? driver.id ?? index + 1}`;
          const carType = driver.carType || driver.carModel || 'Car type unavailable';

          return (
            <View
              key={driver.driverId ?? driver.id ?? `ai-driver-${index}`}
              style={styles.card}
            >
              <View style={styles.cardHeader}>
                <Image source={{ uri: imageUrl }} style={styles.avatar} />

                <View style={styles.cardHeaderText}>
                  <Text style={styles.cardTitle}>{displayName}</Text>
                  <Text style={styles.cardMeta}>{carType}</Text>
                  <Text style={styles.cardMeta}>
                    {driver.vehiclePlateNumber || 'Plate not available'}
                  </Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.metaPill}>
                  <Text style={styles.metaPillText}>{formatScore(driver.score)}</Text>
                </View>

                <View style={styles.metaPill}>
                  <Text style={styles.metaPillText}>{formatRating(driver.rating)}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    padding: 16,
    paddingBottom: 36,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 20,
  },
  centeredCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 18,
    alignItems: 'center',
    marginBottom: 14,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#374151',
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  backButtonText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 20,
    marginBottom: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    color: '#4b5563',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  heroMetaRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  heroPill: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  heroPillLabel: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  heroPillValue: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 14,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: '#111827',
  },
  banner: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    backgroundColor: '#eff6ff',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  bannerText: {
    color: '#111827',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
  emptyStateCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 18,
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  emptyStateTitle: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 6,
  },
  helperText: {
    color: '#6b7280',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 18,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 14,
    backgroundColor: '#f3f4f6',
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  cardMeta: {
    color: '#4b5563',
    fontSize: 14,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  metaPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  metaPillText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '700',
  },
});
