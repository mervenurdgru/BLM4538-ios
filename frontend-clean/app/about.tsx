import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function About() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>ℹ️ Hakkımızda</Text>

      <Text style={styles.description}>
        Bu uygulama, barkod tarama teknolojisini kullanarak yiyecek ve içecek ürünlerinin içerik bilgilerini hızlı ve kolay bir şekilde öğrenmenizi sağlar. Barkodu okutarak ürün adı, içerik, alerjen bilgisi, menşei ve besin değerlerini anında öğrenebilirsiniz.
      </Text>

      <Text style={styles.sectionTitle}>🚀 Özellikler:</Text>
      <Text style={styles.listItem}>🔸 Barkod ile ürün bilgisi sorgulama</Text>
      <Text style={styles.listItem}>🔸 Favori ürün listesi oluşturma</Text>
      <Text style={styles.listItem}>🔸 Geçmiş tarama kayıtlarını görüntüleme</Text>
      <Text style={styles.listItem}>🔸 Modern ve kullanıcı dostu arayüz</Text>

      <Text style={styles.sectionTitle}>🎯 Misyonumuz</Text>
      <Text style={styles.description}>
        Kullanıcılarımıza sağlıklı ve bilinçli alışveriş yapabilmeleri için doğru ürün bilgilerini sunmak.
      </Text>

      <Text style={styles.sectionTitle}>📬 İletişim</Text>
      <Text style={styles.description}>Destek için: destek@uygulama.com</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#0e0f1a', flexGrow: 1 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#b0c4de', marginBottom: 16, textAlign: 'center' },
  description: { fontSize: 16, color: '#fff', marginBottom: 12, lineHeight: 22 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#b0c4de', marginTop: 16, marginBottom: 8 },
  listItem: { fontSize: 16, color: '#fff', marginLeft: 10, marginBottom: 4 },
});
