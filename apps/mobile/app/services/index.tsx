import { useEffect, useState } from "react";
import { Link } from "expo-router";
import { View, Text, FlatList, ActivityIndicator, Pressable, StyleSheet, TextInput } from "react-native";
import Constants from "expo-constants";

const API = (Constants.expoConfig?.extra?.apiUrl as string) || "http://localhost:4000";

interface Service {
  id: string;
  slug: string;
  name: { en: string };
  description: { en: string };
  fee: number;
  processingDays: number;
}

export default function ServicesScreen() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch(`${API}/api/services`)
      .then((r) => r.json())
      .then(setServices)
      .finally(() => setLoading(false));
  }, []);

  const filtered = services.filter((s) =>
    s.name.en.toLowerCase().includes(q.toLowerCase())
  );

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search services…"
        value={q}
        onChangeText={setQ}
        style={styles.search}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/services/${item.slug}`} asChild>
            <Pressable style={styles.card}>
              <Text style={styles.cardTitle}>{item.name.en}</Text>
              <Text style={styles.cardDesc}>{item.description.en}</Text>
              <Text style={styles.cardMeta}>
                Fee: {item.fee} ETB · {item.processingDays} days
              </Text>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F8FAFC" },
  search: { backgroundColor: "white", padding: 14, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: "#cbd5e1", fontSize: 16 },
  card: { backgroundColor: "white", padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: "#e2e8f0" },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#0B3D91" },
  cardDesc: { fontSize: 14, color: "#64748b", marginVertical: 6 },
  cardMeta: { fontSize: 13, color: "#475569" },
});
