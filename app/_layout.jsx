import { StyleSheet, View, ActivityIndicator } from "react-native";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMemo } from "react";

const COLORS = {
  background: "#FBF0DD",
  primary: "#000",
};

const Layout = () => {
  const [fontsLoaded] = useFonts({
    Gabriola: require("../assets/fonts/gabriola.ttf"),
    ConcertOne: require("../assets/fonts/concert-one.ttf"),
  });

  const screenOptions = useMemo(
    () => ({
      headerTitleAlign: "center",
      headerStyle: {
        backgroundColor: COLORS.background,
      },
      headerTitleStyle: {
        fontFamily: "ConcertOne",
        color: COLORS.primary,
      },
      contentStyle: {
        backgroundColor: COLORS.background,
      },
    }),
    [],
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="about" options={{ title: "About" }} />
      <Stack.Screen name="dashboard" options={{ title: "Furhaven" }} />
    </Stack>
  );
};

export default Layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
});
