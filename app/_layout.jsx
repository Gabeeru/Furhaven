import { StyleSheet, View, ActivityIndicator } from "react-native";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";

const COLORS = {
  background: "#FBF0DD",
  primary: "#000",
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Gabriola: require("../assets/fonts/gabriola.ttf"),
    ConcertOne: require("../assets/fonts/concert-one.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="(protected)" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
});
