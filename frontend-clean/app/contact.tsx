import { View, Text, StyleSheet } from 'react-native';
export default function Contact() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>📞 Bize Ulaşın</Text>
      <Text style={styles.description}>Email: destek@uygulama.com</Text>
      <Text style={styles.description}>Telefon: +90 555 555 5555</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  description: { fontSize: 16 },
});
