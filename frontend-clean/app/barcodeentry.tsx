import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Modern ikonlar için

export default function BarcodeEntry() {
  const [barcode, setBarcode] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    const cleaned = barcode.trim();
    if (!cleaned) {
      Alert.alert('Hata', 'Lütfen barkod numarası girin.');
      return;
    }
    router.push(`/details?barkod=${encodeURIComponent(cleaned)}`);
  };

  return (
    <View style={styles.container}>
      {/* Geri butonu */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/camera')}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
        <Text style={styles.backText}>Kameraya Dön</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Barkod Numaranızı Girin</Text>
      <TextInput
        style={styles.input}
        placeholder="Barkod numarası"
        value={barcode}
        onChangeText={setBarcode}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Sorgula</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0e0f1a', padding: 24 },
  backButton: { position: 'absolute', top: 50, left: 20, flexDirection: 'row', alignItems: 'center' },
  backText: { color: '#fff', marginLeft: 6, fontSize: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  input: { width: '80%', borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 16, backgroundColor: '#fff' },
  button: { backgroundColor: '#075eec', padding: 12, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 18 },
});
