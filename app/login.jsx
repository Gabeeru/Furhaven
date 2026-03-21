import { View, Text, Image, TextInput } from "react-native";
import React from "react";
import styles from "../styles/globalStyle";

const COLORS = {
  background: "#FBF0DD",
  primary: "#0E2347",
};

const login = () => {
  return (
    <View>
      <Image
        source={require("../assets/login/login-animal.png")}
        style={styles.logo}
      />
      <Text style={styles.loginText}>LOG IN</Text>

      <View style={styles.loginContainer}>
        <Text>Email</Text>
        <TextInput style={styles.textInputs} placeholder="Enter your email" />
      </View>
    </View>
  );
};

export default login;
