import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import api from '../../src/services/api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage('Please enter email and password.');
      Alert.alert('Validation', 'Please enter email and password.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const response = await api.post('/Auth/login', {
        email,
        password,
      });

      const user = response.data;

      // 🔥 SAVE USER + TOKEN (CRITICAL)
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('token', user.token);

      console.log('Saved user:', user);

      setMessage(`Welcome ${user.fullName} (${user.role})`);

      if (user.role === 'Passenger') {
        router.replace('../(main)/passenger');
      } else if (user.role === 'Driver') {
        router.replace('../(main)/driver');
      } else if (user.role === 'AIManager') {
        router.replace('../(main)/ai');
      }
    } catch (error: any) {
      const backendMessage =
        error?.response?.data ||
        error?.message ||
        'Invalid email or password';

      setMessage(backendMessage);
      Alert.alert('Login Failed', backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topHalf}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoPlaceholderText}>APP LOGO</Text>
        </View>

        <Text style={styles.heroTitle}>Taxi Manager</Text>
        <Text style={styles.heroSubtitle}>
          Your daily rides, managed with clarity.
        </Text>
      </View>

      <View style={styles.bottomHalf}>
        <View style={styles.formCard}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>
            Sign in with your email and password.
          </Text>

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
    marginTop: 14,
    textAlign: 'center',
    color: '#1d4ed8',
  },
});
