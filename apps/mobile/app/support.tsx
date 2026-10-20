import { useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import Constants from "expo-constants";

const API = (Constants.expoConfig?.extra?.apiUrl as string) || "http://localhost:4000";

export default function SupportScreen() {
  const [faqs, setFaqs] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API}/api/support/faq`)
      .then((r) => r.json())
      .then(setFaqs);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {faqs.map((f) => (
        <View key={f.id} style={styles.card}>
          <Text style={styles.q}>{f.q.en}</Text>
          <Text style={styles.a}>{f.a.en}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#F8FAFC" },
  card: { backgroundColor: "white", padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: "#e2e8f0" },
  q: { fontSize: 16, fontWeight: "700", color: "#0B3D91" },
  a: { fontSize: 14, color: "#475569", marginTop: 6 },
});
