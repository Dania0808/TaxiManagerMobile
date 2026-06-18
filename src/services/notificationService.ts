import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import api from './api';

const REGISTERED_PUSH_TOKEN_KEY = 'registeredPushToken';

type StoredUser = {
  id?: number;
  role?: string;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function getProjectId() {
  return (
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId ??
    undefined
  );
}

function isExpoGo() {
  const executionEnvironment = String(
    (Constants as typeof Constants & { executionEnvironment?: string })
      ?.executionEnvironment ?? ''
  ).toLowerCase();

  const appOwnership = String(
    (Constants as typeof Constants & { appOwnership?: string })?.appOwnership ?? ''
  ).toLowerCase();

  return executionEnvironment === 'storeclient' || appOwnership === 'expo';
}

async function getStoredUser(): Promise<StoredUser | null> {
  const rawUser = await AsyncStorage.getItem('user');
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as StoredUser;
  } catch {
    return null;
  }
}

export async function registerPushNotificationsAsync() {
  const storedUser = await getStoredUser();
  if (!storedUser?.id || !storedUser?.role) {
    return { ok: false, reason: 'missing-user' as const };
  }

  if (isExpoGo()) {
    return { ok: false, reason: 'expo-go-unsupported' as const };
  }

  const permissionStatus = await Notifications.getPermissionsAsync();
  let finalStatus = permissionStatus.status;

  if (finalStatus !== 'granted') {
    const requestedPermissions = await Notifications.requestPermissionsAsync();
    finalStatus = requestedPermissions.status;
  }

  if (finalStatus !== 'granted') {
    return { ok: false, reason: 'permission-denied' as const };
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#facc15',
    });
  }

  const projectId = getProjectId();
  if (!projectId) {
    return { ok: false, reason: 'missing-project-id' as const };
  }

  const expoPushToken = await Notifications.getExpoPushTokenAsync({ projectId });
  const pushToken = expoPushToken.data;
  const alreadyRegisteredToken = await AsyncStorage.getItem(REGISTERED_PUSH_TOKEN_KEY);

  if (alreadyRegisteredToken === pushToken) {
    return { ok: true, token: pushToken, skipped: true as const };
  }

  await api.post('/Notifications/register-token', {
    userId: storedUser.id,
    role: storedUser.role,
    pushToken,
    platform: Platform.OS,
    deviceName: Constants.deviceName ?? '',
  });

  await AsyncStorage.setItem(REGISTERED_PUSH_TOKEN_KEY, pushToken);

  return { ok: true, token: pushToken, skipped: false as const };
}

export async function removePushNotificationsAsync() {
  const storedUser = await getStoredUser();
  const pushToken = await AsyncStorage.getItem(REGISTERED_PUSH_TOKEN_KEY);

  if (!storedUser?.id || !pushToken) {
    return;
  }

  try {
    await api.post('/Notifications/remove-token', {
      userId: storedUser.id,
      pushToken,
    });
  } finally {
    await AsyncStorage.removeItem(REGISTERED_PUSH_TOKEN_KEY);
  }
}
