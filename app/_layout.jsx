import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  Pressable,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";

const COLORS = {
  background: "#FBF0DD",
  primary: "#000",
};

const Layout = () => {
  const router = useRouter();

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

      headerRight: () => (
        <Pressable
          onPress={() => router.push("/menu")}
          style={{ marginRight: 10 }}
        >
          <Ionicons name="menu" size={26} color={COLORS.primary} />
        </Pressable>
      ),
    }),
    [router],
  );

  if (!fontsLoaded) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="about" options={{ title: "About" }} />
      <Stack.Screen
        name="menu"
        options={{
          title: "Menu",
          headerRight: () => (
            <Pressable
              onPress={() => router.push("/dashboard")}
              style={{ marginRight: 10 }}
            >
              <Ionicons name="home-outline" size={26} color={COLORS.primary} />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen name="dashboard" options={{ title: "Furhaven" }} />
    </Stack>
  );
};

export default Layout;

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
});
