import { Stack } from "expo-router";

const COLORS = {
  background: "#FBF0DD",
  primary: "#332115",
};

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{
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
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="login"
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="register"
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="complete-profile"
        options={{ headerShown: false, animation: "none" }}
      />
    </Stack>
  );
};

export default AuthLayout;
