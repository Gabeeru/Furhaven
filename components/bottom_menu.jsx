import { View, Text, TouchableHighlight } from "react-native";
import React from "react";
import styles from "../styles/globalStyle";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const menu = [
  { id: "1", name: "Home", icon: "home" },
  { id: "2", name: "Request List", icon: "document-text" },
  { id: "3", name: "My Pets", icon: "paw" },
  { id: "4", name: "Profile", icon: "person" },
  { id: "5", name: "Notifications", icon: "notifications" },
];

const bottom_menu = () => {
  const router = useRouter();

  const handleMenuPress = (menuItem) => {
    console.log("Navigating to:", menuItem);
    
    // Navigation logic
    if (menuItem === "Home") {
      router.push("/protected/dashboard");
    }
    if (menuItem === "Request List") {
      router.push("/protected/adoptionlist");
    }
    if (menuItem === "My Pets") {
      router.push("/protected/mypet");
    }
    if (menuItem === "Profile") {
      router.push("/protected/profile");
    }
    if (menuItem === "Notifications") {
      router.push("/protected/notification");
    }
  };

  return (
    <View style={styles.menucont}>
      <View style={styles.navBar}>
        {menu.map((item) => (
          <TouchableHighlight
            key={item.id}
            style={styles.menuButton}
            onPress={() => handleMenuPress(item.name)}
            underlayColor="#D9C2A3"
            activeOpacity={0.8}
          >
            <Ionicons name={item.icon} size={24} color="#5D3A29" />
          </TouchableHighlight>
        ))}
      </View>
    </View>
  );
};

export default bottom_menu;