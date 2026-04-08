import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import AppNavbar from '../../src/components/AppNavbar'; // ✅ ADDED
import api from '../../src/services/api';

type StoredUser = {
  fullName?: string;
};

export default function AiManagerScreen() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [notLoggedIn, setNotLoggedIn] = useState(false);

  const [summary, setSummary] = useState<any>(null);
  const [activeRides, setActiveRides] = useState<any[]>([]);
  const [availableDrivers, setAvailableDrivers] = useState<any[]>([]);
  const [pendingRecommendations, setPendingRecommendations] = useState<any[]>([]);

  const [rideId, setRideId] = useState('');
  const [bestDriver, setBestDriver] = useState<any>(null);
  const [message, setMessage] = useState('');

  const loadUser = async () => {
    try {
      setLoadingUser(true);
      const storedUser = await AsyncStorage.getItem('user');

      if (!storedUser) {
        setNotLoggedIn(true);
        return;
      }

      setUser(JSON.parse(storedUser));
    } catch {
      setNotLoggedIn(true);
    } finally {
      setLoadingUser(false);
    }
  };

  const handleGetSummary = async () => {
    try {
      const res = await api.get('/Rides/dashboard-summary');
      setSummary(res.data);
    } catch {
      setMessage('Failed to load summary');
    }
  };

  const handleGetActiveRides = async () => {
    try {
      const res = await api.get('/Rides/active');
      setActiveRides(res.data);
    } catch {
      setMessage('Failed to load active rides');
    }
  };

  const handleGetAvailableDrivers = async () => {
    try {
      const res = await api.get('/Rides/available-drivers');
      setAvailableDrivers(res.data);
    } catch {
      setMessage('Failed to load drivers');
    }
  };

  const handleGetPendingRecommendations = async () => {
    try {
      const res = await api.get('/Rides/pending-recommendations');
      setPendingRecommendations(res.data);
    } catch {
      setMessage('Failed to load recommendations');
    }
  };

  const handleGetBestDriver = async () => {
    if (!rideId) {
      setMessage('Enter ride id');
      return;
    }

    try {
      const res = await api.get(`/Rides/best-driver/${rideId}`);
      setBestDriver(res.data);
    } catch {
      setBestDriver(null);
      setMessage('Failed to get best driver');
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    handleGetSummary();
    handleGetActiveRides();
    handleGetAvailableDrivers();
    handleGetPendingRecommendations();
  }, []);

  if (notLoggedIn) {
    return <Redirect href="/(auth)" />;
  }

  if (loadingUser) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* ✅ NAVBAR */}
      <AppNavbar fullName={user?.fullName} />

      {/* ✅ CONTENT */}
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>AI Manager Dashboard</Text>

        <Text style={styles.subtitle}>
          Welcome {user?.fullName}
        </Text>

        {message ? <Text style={styles.message}>{message}</Text> : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Summary</Text>
          <Text>Active Rides: {summary?.activeRidesCount ?? '-'}</Text>
          <Text>Pending Rides: {summary?.pendingRidesCount ?? '-'}</Text>
          <Text>Available Drivers: {summary?.availableDriversCount ?? '-'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Active Rides</Text>
          <Button title="Refresh" onPress={handleGetActiveRides} />

          {activeRides.map((ride) => (
            <View key={ride.id} style={styles.innerCard}>
              <Text>Ride: {ride.id}</Text>
              <Text>Status: {ride.status}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>AI Recommendations</Text>
          <Button title="Refresh" onPress={handleGetPendingRecommendations} />

          {pendingRecommendations.map((r) => (
            <View key={r.rideId} style={styles.innerCard}>
              <Text>Ride: {r.rideId}</Text>
              <Text>Driver: {r.recommendedDriverName}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Manual AI Check</Text>

          <TextInput
            placeholder="Ride ID"
            value={rideId}
            onChangeText={setRideId}
            style={styles.input}
          />

          <Button title="Analyze" onPress={handleGetBestDriver} />

          {bestDriver && (
            <View style={styles.innerCard}>
              <Text>{bestDriver.driverName}</Text>
              <Text>Score: {bestDriver.score}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { marginBottom: 15 },

  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 12,
    borderRadius: 8,
  },

  innerCard: {
    borderWidth: 1,
    borderColor: '#eee',
    padding: 10,
    marginTop: 8,
    borderRadius: 6,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 6,
  },

  message: {
    textAlign: 'center',
    marginBottom: 10,
    color: 'blue',
  },
});