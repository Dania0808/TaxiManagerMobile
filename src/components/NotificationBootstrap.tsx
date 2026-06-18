import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
  addNotificationTapListener,
  handleLastNotificationTap,
  registerPushNotificationsAsync,
} from '../services/notificationService';

export default function NotificationBootstrap() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const bootstrapNotifications = async () => {
      try {
        const result = await registerPushNotificationsAsync();

        if (!isMounted) {
          return;
        }

        if (!result.ok && result.reason !== 'missing-user') {
          console.log('PUSH REGISTRATION SKIPPED:', result.reason);
        }
      } catch (error) {
        if (isMounted) {
          console.log('PUSH REGISTRATION ERROR:', error);
        }
      }
    };

    bootstrapNotifications();

    handleLastNotificationTap((route) => {
      router.push(route);
    }).catch((error) => {
      console.log('LAST NOTIFICATION TAP ERROR:', error);
    });

    const unsubscribe = addNotificationTapListener((route) => {
      router.push(route);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [router]);

  return null;
}
