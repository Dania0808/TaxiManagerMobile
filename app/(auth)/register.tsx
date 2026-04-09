import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import api from '../../src/services/api';

export default function RegisterScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Passenger' | 'Driver'>('Passenger');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      setMessage('Please fill in your name, email, and password.');
      Alert.alert('Validation', 'Please fill in your name, email, and password.');
      return;
    }

    try {
      const payload = {
        fullName,
        email,
        password,
        role,
      };

      const response = await api.post('/Auth/register', payload);

      console.log('REGISTER RESPONSE:', response.data);

      setMessage(response.data);

      setTimeout(() => {
        router.replace('/');
      }, 1200);
    } catch (error: any) {
      console.log('REGISTER ERROR:', error?.response?.data || error.message);
      setMessage('Registration failed');
      Alert.alert('Error', 'Registration failed');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topHalf}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoPlaceholderText}>APP LOGO</Text>
        </View>

        <Text style={styles.heroTitle}>Create Account</Text>
        <Text style={styles.heroSubtitle}>
          Register as a passenger or driver and get started.
        </Text>
      </View>

      <View style={styles.bottomHalf}>
        <View style={styles.formCard}>
          <Text style={styles.title}>Register</Text>
          <Text style={styles.subtitle}>
            Fill in your details and choose your role.
          </Text>

          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#9ca3af"
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
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

          <Pressable style={styles.primaryButton} onPress={handleRegister}>
            <Text style={styles.primaryButtonText}>Register</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryAction}
            onPress={() => router.replace('/')}
          >
            <Text style={styles.secondaryActionText}>Back to Login</Text>
          </Pressable>

          {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  topHalf: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#e5e7eb',
  },
  logoPlaceholder: {
    width: 180,
    height: 180,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoPlaceholderText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: '#6b7280',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
  },
  bottomHalf: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 28,
    marginTop: -26,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
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
    marginTop: 14,
    textAlign: 'center',
    color: '#1d4ed8',
  },
});
