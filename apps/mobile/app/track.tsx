import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import Constants from "expo-constants";

const API = (Constants.expoConfig?.extra?.apiUrl as string) || "http://localhost:4000";

export default function TrackScreen() {
  const [num, setNum] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function track() {
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${API}/api/applications/track/${num}`);
      if (!res.ok) throw new Error("Not found");
      setResult(await res.json());
    } catch {
      setError("Tracking number not found");
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="OG-2026-XXXXXXXX"
        value={num}
        onChangeText={setNum}
        style={styles.input}
      />
      <Pressable onPress={track} style={styles.btn}>
        <Text style={styles.btnText}>Track</Text>
      </Pressable>
      {error && <Text style={styles.error}>{error}</Text>}
      {result && (
        <View style={styles.card}>
          <Text style={styles.row}><Text style={styles.bold}>Tracking:</Text> {result.trackingNumber}</Text>
          <Text style={styles.row}><Text style={styles.bold}>Status:</Text> {result.status}</Text>
          <Text style={styles.row}><Text style={styles.bold}>Service:</Text> {result.serviceName?.en}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8FAFC" },
  input: { backgroundColor: "white", padding: 14, borderRadius: 10, borderWidth: 1, borderColor: "#cbd5e1", fontSize: 16 },
  btn: { backgroundColor: "#0B3D91", padding: 16, borderRadius: 10, marginTop: 12, minHeight: 56, justifyContent: "center" },
  btnText: { color: "white", textAlign: "center", fontSize: 18, fontWeight: "700" },
  card: { backgroundColor: "white", padding: 16, borderRadius: 12, marginTop: 16 },
  row: { fontSize: 15, marginVertical: 4 },
  bold: { fontWeight: "700" },
  error: { color: "#b91c1c", marginTop: 12, textAlign: "center" },
});
