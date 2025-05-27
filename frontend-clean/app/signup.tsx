import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://172.20.10.2:5000'; // backend URL'in

export default function SignUpScreen() {
  const router = useRouter();
  const [form, setForm] = useState({ KullaniciAdi: '', Email: '', Sifre: '' });

  const handleSignUp = async () => {
    if (!form.KullaniciAdi || !form.Email || !form.Sifre) {
      Alert.alert('Hata', 'Tüm alanları doldurun.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Bir hata oluştu.');

      if (data.token) {
        await AsyncStorage.setItem('token', data.token); // Token kaydediliyor
        Alert.alert('Başarılı', 'Kayıt başarılı! Giriş yapıldı.');
        router.replace('/'); // Anasayfaya yönlendir
      } else {
        Alert.alert('Kayıt başarılı', 'Giriş yapmak için login sayfasına gidin.');
        router.push('/login');
      }
    } catch (error) {
      Alert.alert('Hata', error instanceof Error ? error.message : 'Sunucu hatası');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>
      <TextInput style={styles.input} placeholder="Kullanıcı Adı" value={form.KullaniciAdi}
        onChangeText={text => setForm({ ...form, KullaniciAdi: text })} />
      <TextInput style={styles.input} placeholder="Email" value={form.Email} keyboardType="email-address"
        onChangeText={text => setForm({ ...form, Email: text })} />
      <TextInput style={styles.input} placeholder="Şifre" secureTextEntry value={form.Sifre}
        onChangeText={text => setForm({ ...form, Sifre: text })} />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Kayıt Ol</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.link}>Zaten hesabınız var mı? Giriş yap.</Text>
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
