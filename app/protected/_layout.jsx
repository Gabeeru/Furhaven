import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import AuthGuard from "../../components/AuthGuard";

const COLORS = {
  background: "#FBF0DD",
  primary: "#000",
};

export default function ProtectedLayout() {
  const router = useRouter();

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
        <Pressable onPress={() => router.push("/protected/menu")}>
          <Ionicons name="menu" size={26} color={COLORS.primary} />
        </Pressable>
      ),
    }),
    [router],
  );

  return (
    <AuthGuard>
      <Stack screenOptions={screenOptions}>
        <Stack.Screen name="dashboard" options={{ title: "Furhaven" }} />
        <Stack.Screen name="menu" options={{ title: "Menu" }} />
        <Stack.Screen
          name="about"
          options={{ title: "About", animation: "none" }}
        />
        <Stack.Screen
          name="mypet"
          options={{ title: "Furhaven", animation: "none" }}
        />
        <Stack.Screen
          name="petprofile"
          options={{ title: "Furhaven", animation: "none" }}
        />
        <Stack.Screen
          name="profile"
          options={{ title: "Furhaven", animation: "none" }}
        />
        <Stack.Screen
          name="addpet"
          options={{ title: "Furhaven", animation: "none" }}
        />
        <Stack.Screen
          name="editpet"
          options={{ title: "Furhaven", animation: "none" }}
        />

        <Stack.Screen
          name="adoptionlist"
          options={{ title: "Furhaven", animation: "none" }}
        />
        <Stack.Screen
          name="adoptionrequest"
          options={{ title: "Furhaven", animation: "none" }}
        />
        <Stack.Screen
          name="notification"
          options={{ title: "Furhaven", animation: "none" }}
        />
        <Stack.Screen
          name="adoptedpets"
          options={{ title: "Furhaven", animation: "none" }}
        />
      </Stack>
    </AuthGuard>
  );
}
