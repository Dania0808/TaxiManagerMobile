import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
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
      <Text style={styles.title}>Taxi Manager Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}

      <Button
        title="Create new account"
        onPress={() => router.push('/register')}
      />

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: {
    fontSize: 26,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  message: {
    marginTop: 15,
    textAlign: 'center',
    color: 'blue',
  },
});