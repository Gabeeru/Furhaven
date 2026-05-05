import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import styles from "../../styles/globalStyle";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Link } from "expo-router";
import { auth, db } from "../../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";

const COLORS = {
  background: "#FBF0DD",
  primary: "#332115",
  secondary: "#B07D5E",
  accent: "#2D1D13",
  white: "#FFFFFF",
};

const register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confpassword, setConfPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const passwordsMatch = (password) => {
    if (password !== confpassword) {
      alert("Passwords do not match. Please try again.");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!passwordsMatch(password)) {
      return;
    }
    if (!username || !email || !password || !confpassword) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      setLoading(true);
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCred.user;
      // Create a document in the users collection
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        username: username,
        createdAt: new Date(),
      });
      alert("User created successfully!");
      router.push("/welcome");
    } catch (error) {
      console.log("Error creating user:", error);
      alert("Failed to create user: " + error.message);
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

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.textInputs}
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
          />
        </View>
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
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.textInputs}
            secureTextEntry={true}
            placeholder="Confirm your password"
            value={confpassword}
            onChangeText={setConfPassword}
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
          {loading ? "Signing up..." : "Sign Up"}
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
