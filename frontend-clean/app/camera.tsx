import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons'; 

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (permission?.status !== 'granted') {
      requestPermission();
    }
  }, []);

  // 🔥 Ekran odaklanınca scanned state'i sıfırla
  useFocusEffect(
    React.useCallback(() => {
      setScanned(false);
    }, [])
  );

  const handleBarCodeScanned = (scanningResult: BarcodeScanningResult) => {
    if (scanned) return;
    setScanned(true);
    const data = scanningResult.data.trim();
    router.push(`/details?barkod=${encodeURIComponent(data)}`);
  };

  if (!permission || permission.status !== 'granted') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Kamera izni gerekli</Text>
        <TouchableOpacity style={styles.button} onPress={() => requestPermission()}>
          <Text style={styles.buttonText}>Kamera izni ver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'ean13', 'ean8', 'upc_a', 'upc_e', 'code39', 'code128'],
        }}
        onBarcodeScanned={handleBarCodeScanned}
      />
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.manualButton} onPress={() => router.push('/barcodeentry')}>
          <Ionicons name="pencil" size={20} color="#fff" />
          <Text style={styles.manualText}>Barkodu Yazınız</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0f1a' },
  title: { fontSize: 20, color: '#fff', textAlign: 'center', marginTop: 20 },
  button: { backgroundColor: '#075eec', padding: 10, borderRadius: 8, marginTop: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16 },
  bottomContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  manualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#075eec',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  manualText: { color: '#fff', marginLeft: 8, fontSize: 16 },
});
