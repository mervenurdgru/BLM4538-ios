import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://172.20.10.2:5000';

export default function DetailsScreen() {
  const { barkod } = useLocalSearchParams<{ barkod?: string }>();
  const [urun, setUrun] = useState<null | {
    id: number;  // 🔥 id eklendi
    barcode: string;
    productName: string;
    description: string;
    allergens?: string;
    origin?: string;
    imageUrl?: string;
    nutrients?: string;
  }>(null);

  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!barkod) {
        Alert.alert('Hata', 'Barkod bilgisi eksik.');
        return;
      }
      try {
        const response = await fetch(`${API_URL}/api/products/${barkod}`);
        const data = await response.json();
        setUrun(data.urun);
        if (!response.ok) throw new Error(data.message || 'Ürün bulunamadı.');
        setUrun(data.urun);
      } catch (error) {
        Alert.alert('Hata', error instanceof Error ? error.message : 'Sunucu hatası');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [barkod]);

const toggleFavorite = async () => {
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    Alert.alert('Uyarı', 'Favori eklemek için giriş yapmalısınız.');
    return;
  }

  try {
    // 🔥 API çağrısı yap
    const response = await fetch(`${API_URL}/api/users/favorites/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ ProductID: urun?.id }) // Backend ProductID bekliyor
    });

    const data = await response.json();
    if (response.ok) {
      setIsFavorite(!isFavorite);
      Alert.alert(isFavorite ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi');
    } else {
      Alert.alert('Hata', data.message || 'Favori eklenemedi.');
    }
  } catch (error) {
    console.error("Favori Ekleme Hatası:", error);
    Alert.alert('Hata', 'Sunucu hatası.');
  }
};


  if (loading) {
    return <ActivityIndicator size="large" color="#075eec" style={{ flex: 1 }} />;
  }

  if (!urun) {
    return (
      <View style={styles.centered}>
        <Text>Ürün bulunamadı.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ürün İnceleme</Text>
        <TouchableOpacity onPress={toggleFavorite}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={28}
            color={isFavorite ? 'red' : '#333'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.imageBox}>
        {urun.imageUrl ? (
          <Image source={{ uri: urun.imageUrl }} style={styles.image} />
        ) : (
          <Text>Ürün fotoğrafı</Text>
        )}
        <Text style={styles.productName}>{urun.productName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bileşenler:</Text>
        <Text>{urun.description || 'Bilgi yok'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Enerji ve Besin Öğeleri:</Text>
        <Text>{urun.nutrients || 'Bilgi yok'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alerjenler:</Text>
        <Text>{urun.allergens || 'Bilgi yok'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Menşei:</Text>
        <Text>{urun.origin || 'Bilgi yok'}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 16 },
  imageBox: { backgroundColor: '#e0e0e0', padding: 16, borderRadius: 8, alignItems: 'center' },
  image: { width: 120, height: 120, marginBottom: 8 },
  productName: { fontSize: 18, color: '#000', textAlign: 'center' },
  section: { backgroundColor: '#e0e0e0', marginTop: 16, padding: 16, borderRadius: 8 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
