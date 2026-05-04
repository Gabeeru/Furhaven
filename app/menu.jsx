import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import catbg from "../assets/menu/cat_bg.png";
import profile from "../assets/menu/default_profile.png";
import styles from "../styles/globalStyle";
import { Ionicons } from "@expo/vector-icons";
import { ImageBackground } from "react-native";
import { useRouter } from "expo-router";

const COLORS = {
  background: "#FBF0DD",
  primary: "#61372F",
};

<ImageBackground source={catbg} style={styles.catbg}></ImageBackground>;

const menubuttons = [
  { id: "1", name: "Profile", icon: "person" },
  { id: "2", name: "Home", icon: "home" },
  { id: "3", name: "Explore", icon: "paw" },
  { id: "4", name: "Add Pet", icon: "add-circle" },
  { id: "5", name: "Settings", icon: "settings" },
  { id: "6", name: "About", icon: "help-circle" },
  { id: "7", name: "Log-out", icon: "log-out" },
];

const name = "Guest User";
const status = "Active Status";

const menu = () => {
  const router = useRouter();

  const handleMenuPress = (menuItem) => {
    console.log(`Navigating to ${menuItem.name}`);
    if (menuItem.name === "About") {
      // navigation logic to about page
      router.push("/about");
    }
    if (menuItem.name === "Home") {
      router.push("/dashboard");
    }
    if (menuItem.name === "Log-out") {
      router.push("/login");
    }

    // TESTSTS PLEASE REMOVE LATER
    // if (menuItem.name === "Profile") {
    //   router.push("/addprofile");
    // }
    if (menuItem.name === "Profile") {
      router.push("/petprofile");
    }
    if (menuItem.name === "Settings") {
      router.push("/ownerprofile");
    }
  };
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
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={{ margin: 5 }}>Log in</Text>
              </TouchableOpacity>
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
