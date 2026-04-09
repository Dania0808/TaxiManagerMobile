import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
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
import AppNavbar from '../../src/components/AppNavbar';
import {
  getPassengerProfile,
  getPassengerRideHistory,
} from '../../src/services/passengerService';
import {
  PassengerProfileType,
  PassengerRideHistoryItemType,
  StoredUser,
} from '../../src/types/passenger';

const PROFILE_IMAGE_KEY = 'passenger_profile_image_url';
const PROFILE_PHONE_KEY = 'passenger_profile_phone';

export default function PassengerProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [profile, setProfile] = useState<PassengerProfileType | null>(null);
  const [rideHistory, setRideHistory] = useState<PassengerRideHistoryItemType[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [photoDraft, setPhotoDraft] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const storedUser = await AsyncStorage.getItem('user');

        if (!storedUser) {
          setNotLoggedIn(true);
          return;
        }

        const parsedUser: StoredUser = JSON.parse(storedUser);
        setUser(parsedUser);

        const [savedPhone, savedProfileImage] = await Promise.all([
          AsyncStorage.getItem(PROFILE_PHONE_KEY),
          AsyncStorage.getItem(PROFILE_IMAGE_KEY),
        ]);

        setPhoneNumber(savedPhone || parsedUser.phoneNumber || '');
        setProfileImageUrl(savedProfileImage || '');
        setPhotoDraft(savedProfileImage || '');

        if (!parsedUser.passengerId) {
          setProfile({
            fullName: parsedUser.fullName,
            email: parsedUser.email,
            phoneNumber: savedPhone || parsedUser.phoneNumber || '',
            profileImageUrl: savedProfileImage || '',
          });
          return;
        }

        try {
          const remoteProfile = await getPassengerProfile(parsedUser.passengerId);
          setProfile(remoteProfile);
          if (remoteProfile?.phoneNumber) {
            setPhoneNumber(remoteProfile.phoneNumber);
          }
          if (remoteProfile?.profileImageUrl && !savedProfileImage) {
            setProfileImageUrl(remoteProfile.profileImageUrl);
            setPhotoDraft(remoteProfile.profileImageUrl);
          }
        } catch {
          setProfile({
            passengerId: parsedUser.passengerId,
            fullName: parsedUser.fullName,
            email: parsedUser.email,
            phoneNumber: savedPhone || parsedUser.phoneNumber || '',
            profileImageUrl: savedProfileImage || '',
          });
        }

        try {
          const history = await getPassengerRideHistory(parsedUser.passengerId);
          setRideHistory(Array.isArray(history) ? history : []);
        } catch {
          setRideHistory([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSaveLocalProfile = async () => {
    await AsyncStorage.setItem(PROFILE_PHONE_KEY, phoneNumber);
    await AsyncStorage.setItem(PROFILE_IMAGE_KEY, photoDraft);
    setProfileImageUrl(photoDraft);
  };

  if (notLoggedIn) {
    return <Redirect href="/(auth)" />;
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  const avatarUri =
    profileImageUrl || profile?.profileImageUrl || 'https://via.placeholder.com/160';

  return (
    <View style={styles.screen}>
      <AppNavbar
        fullName={user?.fullName}
        profileRoute="/(main)/passenger-profile"
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
          <Text style={styles.name}>{profile?.fullName || user?.fullName || 'Passenger'}</Text>
          <Text style={styles.role}>Passenger Profile</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Details</Text>

          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="email-outline" size={18} color="#4b5563" />
            <Text style={styles.detailText}>{profile?.email || user?.email || 'No email'}</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="phone-outline" size={18} color="#4b5563" />
            <Text style={styles.detailText}>{phoneNumber || 'Phone number not added yet'}</Text>
          </View>

          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Add phone number"
            placeholderTextColor="#9ca3af"
            style={styles.input}
          />

          <Text style={styles.inputLabel}>Profile Image URL</Text>
          <TextInput
            value={photoDraft}
            onChangeText={setPhotoDraft}
            placeholder="Paste image URL"
            placeholderTextColor="#9ca3af"
            style={styles.input}
          />

          <TouchableOpacity style={styles.primaryButton} onPress={handleSaveLocalProfile}>
            <Text style={styles.primaryButtonText}>Save Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ride History</Text>

          {rideHistory.length === 0 ? (
            <Text style={styles.helperText}>
              Ride history will appear here once your backend exposes passenger history.
            </Text>
          ) : (
            rideHistory.map((ride) => (
              <View key={ride.id} style={styles.historyItem}>
                <Text style={styles.historyTitle}>Ride #{ride.id}</Text>
                <Text style={styles.historyText}>
                  {ride.pickupLocation || 'Unknown pickup'} {'->'}{' '}
                  {ride.destination || 'Unknown destination'}
                </Text>
                <Text style={styles.historyMeta}>
                  {ride.rideType || 'Ride'} • {ride.status || 'Unknown status'}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  content: {
    padding: 16,
    paddingBottom: 36,
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 24,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    marginBottom: 14,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  role: {
    fontSize: 13,
    color: '#6b7280',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  detailText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 14,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: '#111827',
  },
  primaryButton: {
    marginTop: 14,
    backgroundColor: '#111827',
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  helperText: {
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 20,
  },
  historyItem: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 14,
    backgroundColor: '#fcfcfc',
    marginBottom: 10,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  historyText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  historyMeta: {
    fontSize: 12,
    color: '#6b7280',
  },
});
