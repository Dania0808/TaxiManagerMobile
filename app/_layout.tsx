import { Stack } from 'expo-router';
import NotificationBootstrap from '../src/components/NotificationBootstrap';

export default function Layout() {
  return (
    <>
      <NotificationBootstrap />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
