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
import api from '../../src/services/api';

const logoImage = require('../../assets/images/taxi-manager-logo.jpeg');

export default function RegisterScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Passenger' | 'Driver'>('Passenger');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'info' | 'error' | 'success'>('info');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value.trim());

  const handleRegister = async () => {
    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedFullName || !trimmedEmail || !trimmedPassword) {
      setMessageType('error');
      setMessage('Please fill in your name, email, and password.');
      Alert.alert('Validation', 'Please fill in your name, email, and password.');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setMessageType('error');
      setMessage('Enter a valid email address before creating your account.');
      Alert.alert('Validation', 'Enter a valid email address before creating your account.');
      return;
    }

    if (trimmedPassword.length < 6) {
      setMessageType('error');
      setMessage('Password should be at least 6 characters.');
      Alert.alert('Validation', 'Password should be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      setMessageType('info');
      setMessage('Creating your account...');
      const payload = {
        fullName: trimmedFullName,
        email: trimmedEmail,
        password: trimmedPassword,
        role,
      };

      const response = await api.post('/Auth/register', payload);

      console.log('REGISTER RESPONSE:', response.data);

      setMessageType('success');
      setMessage(response.data);

      setTimeout(() => {
        router.replace('/');
      }, 1200);
    } catch (error: any) {
      console.log('REGISTER ERROR:', error?.response?.data || error.message);
      const backendMessage = error?.response?.data || error.message || 'Registration failed';
      setMessageType('error');
      setMessage(backendMessage);
      Alert.alert('Error', backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
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

            <Text style={styles.heroTitle}>Create Account</Text>
            <Text style={styles.heroSubtitle}>
              Register as a passenger or driver and get started.
            </Text>
          </View>
        </View>

        <View style={styles.bottomHalf}>
          <View style={styles.formCard}>
            <Text style={styles.title}>Register</Text>
            <Text style={styles.subtitle}>
              Fill in your details and choose your role.
            </Text>

            <View style={styles.helperCard}>
              <Text style={styles.helperTitle}>Choose the role you will use most</Text>
              <Text style={styles.helperText}>
                Passengers request rides and track drivers. Drivers receive nearby trips and manage active rides.
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
              placeholder="Full Name"
              placeholderTextColor="#9ca3af"
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
              returnKeyType="next"
            />

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

            <TextInput
              placeholder="Password"
              placeholderTextColor="#9ca3af"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              returnKeyType="done"
              onSubmitEditing={handleRegister}
            />

            <Text style={styles.roleLabel}>Choose Role</Text>

            <View style={styles.roleContainer}>
              <Pressable
                style={[
                  styles.roleButton,
                  role === 'Passenger' && styles.roleButtonActive,
                ]}
                onPress={() => setRole('Passenger')}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    role === 'Passenger' && styles.roleButtonTextActive,
                  ]}
                >
                  Passenger
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.roleButton,
                  role === 'Driver' && styles.roleButtonActive,
                ]}
                onPress={() => setRole('Driver')}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    role === 'Driver' && styles.roleButtonTextActive,
                  ]}
                >
                  Driver
                </Text>
              </Pressable>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#111827" style={styles.loader} />
            ) : (
              <Pressable style={styles.primaryButton} onPress={handleRegister}>
                <Text style={styles.primaryButtonText}>Register</Text>
              </Pressable>
            )}

            <Pressable
              style={styles.secondaryAction}
              onPress={() => router.replace('/')}
              disabled={loading}
            >
              <Text style={styles.secondaryActionText}>Back to Login</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
  loader: {
    marginVertical: 8,
  },
  roleLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginTop: 6,
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  roleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  roleButtonActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  roleButtonText: {
    color: '#374151',
    fontWeight: '700',
    fontSize: 15,
  },
  roleButtonTextActive: {
    color: '#ffffff',
  },
  primaryButton: {
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
