import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Button,
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
  const [role, setRole] = useState('Passenger');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
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
      <Text style={styles.title}>Taxi Manager Register</Text>

      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      {/* 🔹 Simple role selector (button toggle instead of dropdown) */}
      <View style={styles.roleContainer}>
        <Button
          title="Passenger"
          onPress={() => setRole('Passenger')}
          color={role === 'Passenger' ? 'blue' : 'gray'}
        />
        <Button
          title="Driver"
          onPress={() => setRole('Driver')}
          color={role === 'Driver' ? 'blue' : 'gray'}
        />
      </View>

      <View style={styles.button}>
        <Button title="Register" onPress={handleRegister} />
      </View>

      <View style={styles.button}>
        <Button title="Back to Login" onPress={() => router.replace('/')} />
      </View>

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  button: {
    marginBottom: 10,
  },
  message: {
    marginTop: 20,
    textAlign: 'center',
    color: 'blue',
  },
});