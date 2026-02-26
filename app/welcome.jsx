import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import React from "react";
import styles from "../styles/globalStyle";
import welcomeImg from "../assets/welcome/welcome.png";
import { useRouter } from "expo-router";
import paw from "../assets/welcome/paw.png";

const welcome = () => {
  const router = useRouter();
  return (
    <View style={styles.headerOne}>
      <Image source={welcomeImg} style={styles.welcomeImg} />
      <Text style={styles.welcomeText}>
        Ready to Find Your {`\n`}Forever Friend?
      </Text>
      <Text style={styles.arialText}>
        Thousands of loving pets are waiting for a safe {"\n"} home. Start your
        adoption journey today.
      </Text>

      {/* Button */}
      <TouchableOpacity
        style={styles.getStartedBtn}
        onPress={() => router.push("/dashboard")}
      >
        <Text style={styles.getStartedText}>
          Get Started <Image style={styles.paw} source={paw} />
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default welcome;
