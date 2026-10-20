import { Link } from "expo-router";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";

export default function Home() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>One platform. All government services.</Text>
      <Text style={styles.subtitle}>Sign in with Fayda to access services.</Text>

      <Link href="/services" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Explore Services</Text>
        </Pressable>
      </Link>

      <Link href="/track" asChild>
        <Pressable style={[styles.button, styles.buttonOutline]}>
          <Text style={[styles.buttonText, { color: "#0B3D91" }]}>Track Application</Text>
        </Pressable>
      </Link>

      <Link href="/support" asChild>
        <Pressable style={[styles.button, styles.buttonOutline]}>
          <Text style={[styles.buttonText, { color: "#0B3D91" }]}>Support</Text>
        </Pressable>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: "center", backgroundColor: "#F8FAFC" },
  title: { fontSize: 32, fontWeight: "800", color: "#0B3D91", textAlign: "center" },
  subtitle: { fontSize: 16, color: "#64748b", textAlign: "center", marginTop: 8, marginBottom: 32 },
  button: { backgroundColor: "#0B3D91", paddingVertical: 16, borderRadius: 12, marginBottom: 12, minHeight: 56, justifyContent: "center" },
  buttonOutline: { backgroundColor: "white", borderWidth: 2, borderColor: "#0B3D91" },
  buttonText: { color: "white", fontSize: 18, fontWeight: "700", textAlign: "center" },
});
