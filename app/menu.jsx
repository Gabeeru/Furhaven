import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import catbg from "../assets/menu/cat_bg.png";
import profile from "../assets/menu/default_profile.png";
import styles from "../styles/globalStyle";
import { Ionicons } from "@expo/vector-icons";
import { ImageBackground } from "react-native";

const COLORS = {
  background: "#FBF0DD",
  primary: "#61372F",
};

<ImageBackground source={catbg} style={styles.catbg}></ImageBackground>;

const menubuttons = [
  { id: "1", name: "Home", icon: "home" },
  { id: "2", name: "Explore", icon: "paw" },
  { id: "3", name: "Add Pet", icon: "add-circle" },
  { id: "4", name: "Profile", icon: "person" },
  { id: "5", name: "Settings", icon: "settings" },
];

const handleMenuPress = (menuItem) => {
  console.log(`Navigating to ${menuItem.name}`);
};

const name = "Guest User";
const status = "Active Status";

const menu = () => {
  return (
    <View>
      <ImageBackground
        source={catbg}
        style={styles.background}
        imageStyle={styles.catbg}
        resizeMode="cover"
      >
        <View style={styles.menucontainer}>
          {/* profile */}
          <View style={styles.profilecontainer}>
            <Image source={profile} style={styles.imageprofile}></Image>
            <View style={styles.profiletext}>
              <Text style={[styles.bold, { fontSize: 20 }]}>{name}</Text>
              <Text>{status}</Text>
            </View>
          </View>
          {/* end of profile */}
          <View style={styles.menuButtonContainer}>
            {menubuttons.map((item) => (
              <TouchableOpacity
                style={styles.menuButtons}
                key={item.id}
                onPress={() => handleMenuPress(item)}
              >
                <Ionicons name={item.icon} size={38} color={COLORS.primary} />
                <Text style={styles.menuText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
export default menu;
