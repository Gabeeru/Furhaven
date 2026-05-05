import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import styles from "../../styles/globalStyle";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { useRouter } from "expo-router";
const COLORS = {
  background: "#FBF0DD",
  primary: "#332115",
  secondary: "#B07D5E",
  accent: "#2D1D13",
  white: "#FFFFFF",
};

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      console.log("Login failed: Missing email or password");
      return;
    }
    if (email == "admin" && password == "pass") {
      router.push("/welcome");
      console.log("Login successful");
    } else {
      alert("Invalid email or password. Please try again.");
      console.log(
        "Login failed: Invalid credentials" +
          `Email: ${email}, Password: ${password}`,
      );
    }
  };
  return (
    <View style={styles.innerContainer}>
      <Image
        source={require("../../assets/login/login-animal.png")}
        style={styles.loginlogo}
      />

      <Text style={styles.loginText}>LOG IN</Text>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.textInputs}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.textInputs}
            secureTextEntry={true}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </View>
      <Link href="/auth/register" style={styles.link}>
        Don't have an account? Register
      </Link>

      <TouchableOpacity
        style={[styles.getStartedBtn, { flexDirection: "row" }]}
        onPress={handleLogin}
      >
        <Text style={styles.getStartedText}>Log In</Text>
        <FontAwesome5
          name="paw"
          size={16}
          color={COLORS.accent}
          style={styles.paw}
        />
      </TouchableOpacity>
    </View>
  );
};

export default login;
