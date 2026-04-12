import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Redirect, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
  updatePassengerProfile,
  uploadPassengerProfileImage,
} from '../../src/services/passengerService';
import {
  PassengerProfileType,
  PassengerRideHistoryItemType,
  StoredUser,
} from '../../src/types/passenger';

export default function PassengerProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [profile, setProfile] = useState<PassengerProfileType | null>(null);
  const [rideHistory, setRideHistory] = useState<PassengerRideHistoryItemType[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'info' | 'error' | 'success'>('info');

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

        const profileImageStorageKey = parsedUser.passengerId
          ? `passenger_profile_image_url_${parsedUser.passengerId}`
          : undefined;

        const savedProfileImage = profileImageStorageKey
          ? await AsyncStorage.getItem(profileImageStorageKey)
          : '';

        if (!parsedUser.passengerId) {
          setProfile({
            fullName: parsedUser.fullName,
            email: parsedUser.email,
            phoneNumber: parsedUser.phoneNumber || '',
            profileImageUrl: savedProfileImage || '',
          });
          setPhoneNumber(parsedUser.phoneNumber || '');
          setProfileImageUrl(savedProfileImage || '');
          return;
        }

        try {
          const remoteProfile = await getPassengerProfile(parsedUser.passengerId);
          setProfile(remoteProfile);
          setPhoneNumber(remoteProfile?.phoneNumber || '');
          if (remoteProfile?.profileImageUrl) {
            setProfileImageUrl(remoteProfile.profileImageUrl);
            if (profileImageStorageKey) {
              await AsyncStorage.setItem(
                profileImageStorageKey,
                remoteProfile.profileImageUrl
              );
            }
          } else {
            setProfileImageUrl(savedProfileImage || '');
          }
        } catch {
          setProfile({
            passengerId: parsedUser.passengerId,
            fullName: parsedUser.fullName,
            email: parsedUser.email,
            phoneNumber: parsedUser.phoneNumber || '',
            profileImageUrl: savedProfileImage || '',
          });
          setPhoneNumber(parsedUser.phoneNumber || '');
          setProfileImageUrl(savedProfileImage || '');
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

  const passengerId = user?.passengerId;
  const profileImageStorageKey = passengerId
    ? `passenger_profile_image_url_${passengerId}`
    : undefined;

  const refreshProfile = async () => {
    if (!passengerId) return;
    const remoteProfile = await getPassengerProfile(passengerId);
    setProfile(remoteProfile);
    setPhoneNumber(remoteProfile?.phoneNumber || '');
    if (remoteProfile?.profileImageUrl) {
      setProfileImageUrl(remoteProfile.profileImageUrl);
      if (profileImageStorageKey) {
        await AsyncStorage.setItem(
          profileImageStorageKey,
          remoteProfile.profileImageUrl
        );
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!passengerId) {
      Alert.alert('Profile', 'Passenger profile is not available.');
      return;
    }

    try {
      setSaving(true);
      setStatusType('info');
      setStatusMessage('Saving your profile changes...');
      await updatePassengerProfile(passengerId, {
        fullName: profile?.fullName || user?.fullName || '',
        email: profile?.email || user?.email || '',
        phoneNumber,
      });

      await refreshProfile();
      setStatusType('success');
      setStatusMessage('Profile updated successfully.');
      Alert.alert('Profile', 'Profile updated successfully.');
    } catch (error: any) {
      setStatusType('error');
      setStatusMessage(error?.response?.data || 'Failed to save profile.');
      Alert.alert('Profile', error?.response?.data || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handlePickImage = async (source: 'camera' | 'library') => {
    if (!passengerId) {
      Alert.alert('Profile', 'Passenger profile is not available.');
      return;
    }

    try {
      const permissionResult =
        source === 'camera'
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          'Permission Needed',
          source === 'camera'
            ? 'Camera permission is required to take a photo.'
            : 'Photo library permission is required to choose an image.'
        );
        return;
      }

      const result =
        source === 'camera'
          ? await ImagePicker.launchCameraAsync({
              mediaTypes: ['images'],
              allowsEditing: true,
              quality: 0.8,
            })
          : await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ['images'],
              allowsEditing: true,
              quality: 0.8,
            });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const asset = result.assets[0];
      const uri = asset.uri;
      const fileName = asset.fileName || `passenger-profile-${Date.now()}.jpg`;
      const fileType = asset.mimeType || 'image/jpeg';

      setUploadingImage(true);
      setStatusType('info');
      setStatusMessage('Uploading your profile image...');
      const uploadResponse = await uploadPassengerProfileImage(passengerId, {
        uri,
        name: fileName,
        type: fileType,
      });

      const nextUrl =
        uploadResponse?.profileImageUrl ||
        uploadResponse?.imageUrl ||
        uploadResponse?.url ||
        uri;

      setProfileImageUrl(nextUrl);
      if (profileImageStorageKey) {
        await AsyncStorage.setItem(profileImageStorageKey, nextUrl);
      }
      await refreshProfile();
      setStatusType('success');
      setStatusMessage('Profile photo updated successfully.');
      Alert.alert('Profile', 'Profile photo updated successfully.');
    } catch (error: any) {
      setStatusType('error');
      setStatusMessage(
        error?.response?.data || error?.message || 'Failed to upload profile photo.'
      );
      Alert.alert(
        'Profile Photo',
        error?.response?.data || error?.message || 'Failed to upload profile photo.'
      );
    } finally {
      setUploadingImage(false);
    }
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
        profileImageStorageKey={profileImageStorageKey}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/(main)/passenger')}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="arrow-left" size={18} color="#111827" />
          <Text style={styles.backButtonText}>Back to Passenger Home</Text>
        </TouchableOpacity>

        {statusMessage ? (
          <View
            style={[
              styles.banner,
              statusType === 'error'
                ? styles.bannerError
                : statusType === 'success'
                  ? styles.bannerSuccess
                  : styles.bannerInfo,
            ]}
          >
            <Text style={styles.bannerText}>{statusMessage}</Text>
          </View>
        ) : null}

        <View style={styles.heroCard}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
          <Text style={styles.name}>{profile?.fullName || user?.fullName || 'Passenger'}</Text>
          <Text style={styles.role}>Passenger Profile</Text>

          <View style={styles.imageActionsRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => handlePickImage('library')}
              disabled={uploadingImage}
            >
              <MaterialCommunityIcons name="image-outline" size={16} color="#111827" />
              <Text style={styles.secondaryButtonText}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => handlePickImage('camera')}
              disabled={uploadingImage}
            >
              <MaterialCommunityIcons name="camera-outline" size={16} color="#111827" />
              <Text style={styles.secondaryButtonText}>Camera</Text>
            </TouchableOpacity>
          </View>

          {uploadingImage ? (
            <Text style={styles.helperText}>Uploading profile image...</Text>
          ) : null}
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

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSaveProfile}
            disabled={saving}
          >
            <Text style={styles.primaryButtonText}>
              {saving ? 'Saving...' : 'Save Profile'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ride History</Text>

          {rideHistory.length === 0 ? (
            <Text style={styles.helperText}>No completed rides are available yet.</Text>
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
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
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
    marginBottom: 14,
  },
  imageActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
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
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 14,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: '#111827',
    fontWeight: '700',
    fontSize: 14,
  },
  helperText: {
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 20,
  },
  banner: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  bannerInfo: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  bannerError: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  bannerSuccess: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  bannerText: {
    color: '#111827',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
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
