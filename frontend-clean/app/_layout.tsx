import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: '#0e0f1a' },
        headerTintColor: '#b0c4de',
        drawerStyle: { backgroundColor: '#1c1f2e' },
        drawerActiveTintColor: '#b0c4de',
        drawerInactiveTintColor: '#fff',
      }}
    >
      <Drawer.Screen name="index" options={{ drawerLabel: 'Anasayfa' }} />
      <Drawer.Screen name="favorites" options={{ drawerLabel: 'Favorilerim' }} />
      <Drawer.Screen name="about" options={{ drawerLabel: 'Hakkımızda' }} />
      <Drawer.Screen name="share" options={{ drawerLabel: 'Uygulamayı Paylaş' }} />
      <Drawer.Screen name="contact" options={{ drawerLabel: 'Bize Ulaşın' }} />
      <Drawer.Screen name="history" options={{ drawerLabel: 'Geçmiş' }} />
      <Drawer.Screen name="camera" options={{ drawerLabel: 'Kamera' }} />
      <Drawer.Screen name="login" options={{ drawerLabel: 'Giriş Yap' }} />
    </Drawer>
  );
}
