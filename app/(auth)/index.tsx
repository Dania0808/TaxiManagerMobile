import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../src/services/api';
import { registerPushNotificationsAsync } from '../../src/services/notificationService';

const logoImage = require('../../assets/images/taxi-manager-logo.jpeg');

type LoginResponse = {
  id?: number;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  token?: string;
  passengerId?: number | null;
  driverId?: number | null;
  PassengerId?: number | null;
  DriverId?: number | null;
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'info' | 'error' | 'success'>('info');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value.trim());
  const getLoginErrorMessage = (error: any) => {
    const status = error?.response?.status;
    const backendMessage =
      typeof error?.response?.data === 'string'
        ? error.response.data
        : error?.message || '';

    const normalizedMessage = backendMessage.toLowerCase();

    if (
      status === 401 ||
      normalizedMessage.includes('invalid email or password') ||
      normalizedMessage.includes('unauthorized')
    ) {
      return 'Email or password is incorrect. Please try again.';
    }

    if (
      normalizedMessage.includes('network error') ||
      normalizedMessage.includes('failed to fetch')
    ) {
      return 'Unable to connect right now. Please check your internet and try again.';
    }

    return 'Unable to sign in right now. Please try again.';
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setMessageType('error');
      setMessage('Please enter email and password.');
      Alert.alert('Validation', 'Please enter email and password.');
      return;
    }

    if (!isValidEmail(email)) {
      setMessageType('error');
      setMessage('Enter a valid email address before signing in.');
      return;
    }

    try {
      setLoading(true);
      setMessageType('info');
      setMessage('Signing you in...');

      const response = await api.post('/Auth/login', {
        email,
        password,
      });

      const rawUser = response.data as LoginResponse;
      const user = {
        ...rawUser,
        passengerId: rawUser.passengerId ?? rawUser.PassengerId ?? null,
        driverId: rawUser.driverId ?? rawUser.DriverId ?? null,
      };

      console.log('LOGIN RESPONSE RAW:', rawUser);
      console.log('LOGIN RESPONSE NORMALIZED:', user);

      if (user.role === 'Passenger' && !user.passengerId) {
        setMessageType('error');
        setMessage('Login succeeded but passengerId was not returned by /Auth/login.');
        Alert.alert(
          'Login Data Error',
          'Login succeeded, but /Auth/login did not return passengerId. Ride creation requires TM_Passengers.Id.'
        );
        return;
      }

      if (user.role === 'Driver' && !user.driverId) {
        setMessageType('error');
        setMessage('Login succeeded but driverId was not returned by /Auth/login.');
        Alert.alert(
          'Login Data Error',
          'Login succeeded, but /Auth/login did not return driverId.'
        );
        return;
      }

      // 🔥 SAVE USER + TOKEN (CRITICAL)
      await AsyncStorage.setItem('user', JSON.stringify(user));
      if (user.token) {
        await AsyncStorage.setItem('token', user.token);
      }

      try {
        await registerPushNotificationsAsync();
      } catch (pushError) {
        console.log('PUSH REGISTRATION AFTER LOGIN ERROR:', pushError);
      }

      console.log('Saved user:', user);

      setMessageType('success');
      setMessage(`Welcome ${user.fullName} (${user.role})`);

      if (user.role === 'Passenger') {
        router.replace('../(main)/passenger');
      } else if (user.role === 'Driver') {
        router.replace('../(main)/driver');
      } else if (user.role === 'AIManager') {
        router.replace('../(main)/ai');
      }
    } catch (error: any) {
      const frontendMessage = getLoginErrorMessage(error);

      setMessageType('error');
      setMessage(frontendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 18 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topHalf}>
            <View style={styles.heroCluster}>
              <View style={styles.logoPlaceholder}>
                <Image source={logoImage} style={styles.logoImage} resizeMode="contain" />
              </View>

              <Text style={styles.heroTitle}>Taxi Manager</Text>
              <Text style={styles.heroSubtitle}>
                Your daily rides, managed with clarity.
              </Text>
            </View>
          </View>

          <View style={styles.bottomHalf}>
            <View style={styles.formCard}>
              <Text style={styles.title}>Login</Text>
              <Text style={styles.subtitle}>
                Sign in with your email and password.
              </Text>

              <View style={styles.helperCard}>
                <Text style={styles.helperTitle}>Two roles, one login</Text>
                <Text style={styles.helperText}>
                  Passengers book and track rides. Drivers go online and manage dispatch.
                </Text>
              </View>

              {message ? (
                <View
                  style={[
                    styles.messageCard,
                    messageType === 'error'
                      ? styles.messageCardError
                      : messageType === 'success'
                        ? styles.messageCardSuccess
                        : styles.messageCardInfo,
                  ]}
                >
                  <Text style={styles.message}>{message}</Text>
                </View>
              ) : null}

              <TextInput
                placeholder="Email"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
              />

              <View style={styles.passwordWrap}>
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  style={styles.passwordInput}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <Pressable
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword((v) => !v)}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color="#4b5563"
                  />
                </Pressable>
              </View>

              {loading ? (
                <ActivityIndicator size="large" color="#111827" style={styles.loader} />
              ) : (
                <Pressable style={styles.primaryButton} onPress={handleLogin}>
                  <Text style={styles.primaryButtonText}>Login</Text>
                </Pressable>
              )}

              <Pressable
                style={styles.secondaryAction}
                onPress={() => router.push('/register')}
              >
                <Text style={styles.secondaryActionText}>Create new account</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e5e7eb',
  },
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  topHalf: {
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 26,
    paddingBottom: 44,
    backgroundColor: '#e5e7eb',
  },
  heroCluster: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  logoPlaceholder: {
    width: 152,
    height: 152,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  logoImage: {
    width: '84%',
    height: '84%',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 260,
  },
  bottomHalf: {
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 28,
    marginTop: -2,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    marginTop: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 22,
  },
  helperCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  helperTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  helperText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 19,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    borderRadius: 14,
    color: '#111827',
  },
  passwordWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: '#111827',
  },
  passwordToggle: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  loader: {
    marginVertical: 8,
  },
  primaryButton: {
    marginTop: 6,
    borderRadius: 14,
    backgroundColor: '#111827',
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryAction: {
    marginTop: 18,
    alignItems: 'center',
    paddingVertical: 6,
  },
  secondaryActionText: {
    color: '#4b5563',
    fontSize: 14,
    fontWeight: '600',
  },
  message: {
    textAlign: 'center',
    color: '#111827',
    fontWeight: '600',
  },
  messageCard: {
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  messageCardInfo: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  messageCardError: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  messageCardSuccess: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
});
