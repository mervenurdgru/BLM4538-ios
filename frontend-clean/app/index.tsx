import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons'; // Modern ikonlar için

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Barkod ile Ürün İnceleme</Text>
      <Text style={styles.subtitle}>Kamerayı açarak ürünleri tarayın</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/camera")}>
        <Ionicons name="camera-outline" size={24} color="#0e0f1a" />
        <Text style={styles.buttonText}>Kamerayı Aç</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e0f1a", // Koyu arka plan
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    color: "#b0c4de", // Açık mavi başlık
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#b0c4de",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#0e0f1a",
    fontWeight: "bold",
    marginLeft: 8,
  },
});
