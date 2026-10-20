import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import Constants from "expo-constants";

const API = (Constants.expoConfig?.extra?.apiUrl as string) || "http://localhost:4000";

interface ServiceDetail {
  name: { en: string };
  description: { en: string };
  fee: number;
  processingDays: number;
  requiredDocuments: string[];
}

export default function ServiceDetailScreen() {
  const { slug } = useLocalSearchParams();
  const [svc, setSvc] = useState<ServiceDetail | null>(null);

  useEffect(() => {
    fetch(`${API}/api/services/${slug}`)
      .then((r) => r.json())
      .then(setSvc);
  }, [slug]);

  if (!svc) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{svc.name.en}</Text>
      <Text style={styles.desc}>{svc.description.en}</Text>
      <Text style={styles.meta}>Fee: {svc.fee} ETB</Text>
      <Text style={styles.meta}>Processing: {svc.processingDays} days</Text>

      <Text style={styles.sectionTitle}>Required documents</Text>
      {svc.requiredDocuments?.map((d) => (
        <Text key={d} style={styles.doc}>• {d}</Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#F8FAFC" },
  title: { fontSize: 24, fontWeight: "800", color: "#0B3D91" },
  desc: { fontSize: 15, color: "#475569", marginVertical: 12 },
  meta: { fontSize: 14, color: "#475569", marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginTop: 20, marginBottom: 8 },
  doc: { fontSize: 14, color: "#334155", paddingVertical: 2 },
});
