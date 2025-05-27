import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 🔥 Ekledik

const API_URL = 'http://172.20.10.2:5000';

type Favorite = {
  ProductID: number;
  ProductName: string;
  description?: string;
  price?: number;
};

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // 🔥 Token al
        console.log('Token:', token); // Kontrol için logla

        if (!token) {
          Alert.alert("Uyarı", "Favorileri görmek için giriş yapmalısınız.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/api/users/favorites`, {
          headers: {
            'Authorization': `Bearer ${token}` // 🔥 Header’a ekle
          }
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(errorData);
        }

        const data: Favorite[] = await response.json();
        setFavorites(data);
      } catch (err) {
        Alert.alert("Hata", "Favoriler getirilemedi. Sunucu hatası veya JSON formatı hatalı.");
        console.error("Favoriler Hatası:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#075eec" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favoriler</Text>
      <FlatList
        data={favorites}
        keyExtractor={item => item.ProductID.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemBox}>
            <Text style={styles.item}>{item.ProductName} - {item.price ?? 'Fiyat Yok'} TL</Text>
            <Text style={styles.desc}>{item.description ?? 'Açıklama yok'}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Favori yok</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  itemBox: { backgroundColor: '#f0f0f0', padding: 12, borderRadius: 8, marginBottom: 10 },
  item: { fontSize: 18, fontWeight: 'bold' },
  desc: { fontSize: 14, color: '#555' },
  empty: { textAlign: 'center', marginTop: 20 },
});
