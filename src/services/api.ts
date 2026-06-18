import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios/dist/browser/axios.cjs';

const configuredBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
const fallbackBaseUrl = 'http://localhost:5213/api';
const BASE_URL = configuredBaseUrl || fallbackBaseUrl;

if (!configuredBaseUrl) {
  console.warn(
    `EXPO_PUBLIC_API_BASE_URL is not set. Falling back to ${fallbackBaseUrl}.`
  );
}

const api = axios.create({
  baseURL: BASE_URL,
});

// 🔐 Attach JWT token to every request
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
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
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default api;
