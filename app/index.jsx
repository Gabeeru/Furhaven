import { StyleSheet, Text, View, Image, Button } from "react-native";
import React from "react";
import { Link } from "expo-router";
import styles from "../styles/globalStyle";
import logo from "../assets/index/logo.png";

const Index = () => {
  return (
    <View style={styles.headerOne}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.headerText}>Where Pets Find Forever Homes</Text>
      <Link href="/welcome">Proceed </Link>
    </View>
  );
};

export default Index;
