import React from 'react';
import { View, Text, Button } from 'react-native';
import { logout } from '../utils/authHelper';
import { useRouter } from 'expo-router';

export default function LogoutScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Çıkış yapmak için tıklayın</Text>
      <Button title="Çıkış Yap" onPress={handleLogout} />
    </View>
  );
}
