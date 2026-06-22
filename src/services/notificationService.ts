import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import type { Href } from 'expo-router';
import { Platform } from 'react-native';
import api from './api';

const REGISTERED_PUSH_TOKEN_KEY = 'registeredPushToken';
const REGISTERED_PUSH_REGISTRATION_KEY = 'registeredPushRegistration';

type StoredUser = {
  id?: number;
  role?: string;
};

type StoredPushRegistration = {
  userId: number;
  role: string;
  pushToken: string;
};

type NotificationRouteTarget =
  | '/(main)/passenger'
  | '/(main)/passenger-tracking'
  | '/(main)/passenger-feedback'
  | '/(main)/driver'
  | '/(main)/ai';

type NotificationNavigationPayload = {
  pathname: NotificationRouteTarget;
  params: Record<string, string>;
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

async function getStoredPushRegistration(): Promise<StoredPushRegistration | null> {
  const rawRegistration = await AsyncStorage.getItem(REGISTERED_PUSH_REGISTRATION_KEY);
  if (!rawRegistration) {
    return null;
  }

  try {
    return JSON.parse(rawRegistration) as StoredPushRegistration;
  } catch {
    return null;
  }
}

function getNotificationData(
  response: Notifications.NotificationResponse | null
): Record<string, unknown> | null {
  return response?.notification.request.content.data ?? null;
}

export function resolveNotificationRouteTarget(
  data: Record<string, unknown> | null
): NotificationNavigationPayload | null {
  const target = typeof data?.target === 'string' ? data.target : '';
  const event =
    typeof data?.event === 'string'
      ? data.event
      : typeof data?.status === 'string'
        ? data.status
        : 'notification';
  const params = {
    notificationRefreshAt: `${Date.now()}`,
    notificationEvent: event,
    notificationTarget: target,
  };

  switch (target) {
    case 'passenger_tracking':
      return { pathname: '/(main)/passenger-tracking', params };
    case 'passenger_feedback':
      return { pathname: '/(main)/passenger-feedback', params };
    case 'passenger_home':
      return { pathname: '/(main)/passenger', params };
    case 'driver_home':
      return { pathname: '/(main)/driver', params };
    case 'ai_home':
      return { pathname: '/(main)/ai', params };
    default:
      return null;
  }
}

export function addNotificationTapListener(onNavigate: (route: Href) => void) {
  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      const navigationPayload = resolveNotificationRouteTarget(
        getNotificationData(response)
      );
      if (navigationPayload) {
        onNavigate(navigationPayload as Href);
      }
    }
  );

  return () => subscription.remove();
}

export async function handleLastNotificationTap(
  onNavigate: (route: Href) => void
) {
  const response = await Notifications.getLastNotificationResponseAsync();
  const navigationPayload = resolveNotificationRouteTarget(
    getNotificationData(response)
  );

  if (navigationPayload) {
    onNavigate(navigationPayload as Href);
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
  const previousRegistration = await getStoredPushRegistration();
  const matchesPreviousRegistration =
    previousRegistration?.pushToken === pushToken &&
    previousRegistration?.userId === storedUser.id &&
    previousRegistration?.role === storedUser.role;

  if (matchesPreviousRegistration) {
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
  await AsyncStorage.setItem(
    REGISTERED_PUSH_REGISTRATION_KEY,
    JSON.stringify({
      userId: storedUser.id,
      role: storedUser.role,
      pushToken,
    })
  );

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
    await AsyncStorage.removeItem(REGISTERED_PUSH_REGISTRATION_KEY);
  }
}
