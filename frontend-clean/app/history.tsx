import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://172.20.10.2:5000';

type History = {
  ProductID: number;
  ProductName: string;
  Description?: string;
  Price?: number;
  Barkod?: string;
  TaramaTarihi?: string;
};

export default function HistoryScreen() {
  const [history, setHistory] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('📢 Token:', token);

        if (!token) {
          Alert.alert("Uyarı", "Geçmişi görmek için giriş yapmalısınız.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/api/users/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('❌ API Hatası:', errorData);
          throw new Error('Geçmiş alınamadı.');
        }

        const data = await response.json();
        console.log('📢 Geçmiş Verisi:', data);

        // Backend'den gelen veri dizisini kontrol et ve uyumlu formatla
        const formattedData = data.map((item: any) => ({
          ProductID: item.ProductID,
          ProductName: item.ProductName || 'Ürün Adı Yok',
          Description: item.Description || 'Açıklama Yok',
          Price: item.Price ?? undefined,
          Barkod: item.Barkod ?? 'Yok',
          TaramaTarihi: item.TaramaTarihi ?? 'Yok'
        }));

        setHistory(formattedData);
      } catch (err) {
        console.error("Geçmiş Hatası:", err);
        Alert.alert("Hata", "Geçmiş getirilemedi. Sunucu veya ağ hatası olabilir.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#075eec" />
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Geçmiş</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.ProductID.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemBox}>
            <Text style={styles.item}>{item.ProductName} - {item.Price ?? 'Fiyat Yok'} TL</Text>
            <Text style={styles.desc}>{item.Description}</Text>
            <Text style={styles.barkod}>Barkod: {item.Barkod}</Text>
            <Text style={styles.date}>Tarih: {item.TaramaTarihi}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Henüz geçmiş kaydınız yok.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  itemBox: { backgroundColor: '#f0f0f0', padding: 12, borderRadius: 8, marginBottom: 10 },
  item: { fontSize: 18, fontWeight: 'bold' },
  desc: { fontSize: 14, color: '#555' },
  barkod: { fontSize: 12, color: '#333' },
  date: { fontSize: 12, color: '#666' },
  empty: { textAlign: 'center', marginTop: 20 },
});
