import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BASE_URL = 'http://10.0.0.11:5213/api';

const api = axios.create({
  baseURL: BASE_URL,
});

// 🔐 Attach JWT token to every request
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('TOKEN ERROR:', error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;