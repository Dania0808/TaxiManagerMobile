import { ReactNode } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

type UserType = {
  role?: string;
};

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRole?: string;
};

export default function ProtectedRoute({
  children,
  allowedRole,
}: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('token');

        setUser(storedUser ? JSON.parse(storedUser) : null);
        setToken(storedToken);
      } catch (error) {
        console.log('ProtectedRoute load error:', error);
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user || !token) {
    return <Redirect href="/" />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Redirect href="/" />;
  }

  return <>{children}</>;
}