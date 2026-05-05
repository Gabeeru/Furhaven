import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import styles from "../../styles/globalStyle";
import { FontAwesome5 } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { auth } from "../../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const COLORS = {
  background: "#FBF0DD",
  primary: "#332115",
  secondary: "#B07D5E",
  accent: "#2D1D13",
  white: "#FFFFFF",
};

const register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confpassword, setConfPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const validateInputs = () => {
    if (!email || !password || !confpassword) {
      setError("Please fill in all fields.");
      return false;
    }
    if (password !== confpassword) {
      setError("Passwords do not match.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    setError("");

    if (!validateInputs()) return;

    try {
      setLoading(true);

      // Step 1: Create user with Firebase Auth
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      console.log("Auth user created:", userCred.user.uid);

      // Navigate to complete-profile screen with UID
      // The uid is automatically available via auth.currentUser
      router.push("/auth/complete-profile");
    } catch (error) {
      console.error("Registration error:", error.code);

      if (error.code === "auth/email-already-in-use") {
        setError("Email already in use.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak.");
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.innerContainer}>
      <Image
        source={require("../../assets/register/register-animal.png")}
        style={styles.loginlogo}
      />

      <Text style={styles.loginText}>SIGN UP</Text>

      {error ? (
        <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
      ) : null}

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.textInputs}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            keyboardType="email-address"
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
            editable={!loading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.textInputs}
            secureTextEntry={true}
            placeholder="Confirm your password"
            value={confpassword}
            onChangeText={setConfPassword}
            editable={!loading}
          />
        </View>
      </View>

      <Link href="/auth/login" style={styles.link}>
        Already have an account? Log In
      </Link>

      <TouchableOpacity
        style={[
          styles.getStartedBtn,
          loading && { opacity: 0.5 },
          { flexDirection: "row" },
        ]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.getStartedText}>
          {loading ? "Creating account..." : "Sign Up"}
        </Text>
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

export default register;
