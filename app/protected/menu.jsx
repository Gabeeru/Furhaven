import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React from "react";
import catbg from "../../assets/menu/cat_bg.png";
import profile from "../../assets/menu/default_profile.png";
import styles from "../../styles/globalStyle";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";

const COLORS = {
  background: "#FBF0DD",
  primary: "#61372F",
};

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

  const handleMenuPress = async (menuItem) => {
    console.log(`Navigating to ${menuItem.name}`);

    if (menuItem.name === "About") {
      router.push("/protected/about");
      return;
    }

    if (menuItem.name === "Home") {
      router.push("/protected/dashboard");
      return;
    }

    if (menuItem.name === "Profile") {
      router.push("/protected/petprofile");
      return;
    }

    if (menuItem.name === "Settings") {
      router.push("/protected/ownerprofile");
      return;
    }

    if (menuItem.name === "Log-out") {
      try {
        await signOut(auth);
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        router.replace("/auth/login");
      }
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
          <View style={styles.profilecontainer}>
            <Image source={profile} style={styles.imageprofile} />
            <View style={styles.profiletext}>
              <Text style={[styles.bold, { fontSize: 20 }]}>{name}</Text>
              <Text>{status}</Text>
              <TouchableOpacity onPress={() => router.replace("/auth/login")}>
                <Text style={{ margin: 5 }}>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>

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
