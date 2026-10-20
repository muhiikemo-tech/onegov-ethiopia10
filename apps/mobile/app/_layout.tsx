import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#0B3D91" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "700" },
        }}
      >
        <Stack.Screen name="index" options={{ title: "OneGov Ethiopia" }} />
        <Stack.Screen name="services/index" options={{ title: "Services" }} />
        <Stack.Screen name="services/[slug]" options={{ title: "Service" }} />
        <Stack.Screen name="track" options={{ title: "Track Application" }} />
        <Stack.Screen name="support" options={{ title: "Support" }} />
      </Stack>
    </>
  );
}
