import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
export default function ShareApp() {
  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Barkod ile Ürün İnceleme Uygulamasını indir: https://uygulama-linki.com',
      });
    } catch (error) {
      console.error('Paylaşım hatası:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>📤 Uygulamayı Paylaş</Text>
      <TouchableOpacity style={styles.button} onPress={handleShare}>
        <Text style={styles.buttonText}>Paylaş</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  button: { backgroundColor: '#075eec', padding: 12, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
