import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import styles from "../../styles/globalStyle";
import { FontAwesome5 } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      const userSnap = await getDoc(doc(db, "users", user.uid));

      if (!userSnap.exists()) {
        router.replace("/auth/complete-profile");
        return;
      }

      const profileData = userSnap.data();

      if (profileData.profileComplete !== true) {
        router.replace("/auth/complete-profile");
        return;
      }

      router.replace("/protected/dashboard");
    } catch (error) {
      // Alert.alert("Login error:", error.code);

      if (error.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else if (error.code === "auth/user-not-found") {
        setError("No account found for this email.");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else if (error.code === "auth/invalid-credential") {
        setError("Invalid login credentials.");
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
        source={require("../../assets/login/login-animal.png")}
        style={styles.loginlogo}
      />

      <Text style={styles.loginText}>LOG IN</Text>

      {error ? (
        <Text style={{ color: "red", marginBottom: 10, textAlign: "center" }}>
          {error}
        </Text>
      ) : null}

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.textInputs}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.textInputs}
            secureTextEntry
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />
        </View>
      </View>

      <Link href="/auth/register" style={styles.link}>
        Don't have an account? Register
      </Link>

      <TouchableOpacity
        style={[
          styles.getStartedBtn,
          loading && { opacity: 0.5 },
          { flexDirection: "row" },
        ]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.getStartedText}>
          {loading ? "Logging in..." : "Log In"}
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

export default login;
