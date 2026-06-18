import { useEffect } from 'react';
import { registerPushNotificationsAsync } from '../services/notificationService';

export default function NotificationBootstrap() {
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

    return () => {
      isMounted = false;
    };
  }, []);

  return null;
}
