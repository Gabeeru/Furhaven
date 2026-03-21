import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import styles from "../styles/globalStyle";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

const COLORS = {
  background: "#FBF0DD",
  primary: "#332115",
  secondary: "#B07D5E",
  accent: "#2D1D13",
  white: "#FFFFFF",
};

const login = () => {
  return (
    <View style={styles.innerContainer}>
      <Image
        source={require("../assets/login/login-animal.png")}
        style={styles.loginlogo}
      />

      <Text style={styles.loginText}>LOG IN</Text>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.textInputs} placeholder="Enter your email" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.textInputs}
            secureTextEntry={true}
            placeholder="Enter your password"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.getStartedBtn}>
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
