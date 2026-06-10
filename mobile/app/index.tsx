import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';
import { View, ActivityIndicator } from 'react-native';
import { NEU } from '@/constants/theme';

export default function Index() {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: NEU.surface }}>
        <ActivityIndicator size="large" color="#0EA5E9" />
      </View>
    );
  }
  if (!isAuthenticated) return <Redirect href="/login" />;
  if (user?.role === 'parent')  return <Redirect href="/(parent)/dashboard" />;
  if (user?.role === 'student') return <Redirect href="/(student)/dashboard" />;
  return <Redirect href="/login" />;
}
