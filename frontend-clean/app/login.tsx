import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://172.20.10.2:5000'; // backend URL'in

export default function LoginScreen() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });

  const handleLogin = async () => {
    if (!form.username || !form.password) {
      Alert.alert('Hata', 'Lütfen kullanıcı adı ve şifre girin.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ KullaniciAdi: form.username, Sifre: form.password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Bir hata oluştu.');

      if (data.token) {
        await AsyncStorage.setItem('token', data.token); // Token kaydediliyor
        Alert.alert('Başarılı', 'Giriş başarılı!');
        router.replace('/'); // Anasayfaya yönlendir
      } else {
        Alert.alert('Hata', 'Token alınamadı, lütfen tekrar giriş yapın.');
      }

    } catch (error) {
      Alert.alert('Hata', error instanceof Error ? error.message : 'Bilinmeyen bir hata');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Giriş Yap</Text>
      <TextInput style={styles.input} placeholder="Kullanıcı Adı" value={form.username}
        onChangeText={text => setForm({ ...form, username: text })} />
      <TextInput style={styles.input} placeholder="Şifre" secureTextEntry value={form.password}
        onChangeText={text => setForm({ ...form, password: text })} />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/signup')}>
        <Text style={styles.link}>Hesabınız yok mu? Kayıt olun.</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f9f9f9' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 16, backgroundColor: '#fff' },
  button: { backgroundColor: '#075eec', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  link: { marginTop: 12, color: '#075eec', textAlign: 'center' },
});
