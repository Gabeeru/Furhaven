import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import catbg from "../../assets/menu/cat_bg.png";
import defaultProfile from "../../assets/menu/default_profile.png";
import guyProfile from "../../assets/profile/guy.png";
import girlieProfile from "../../assets/profile/girlie.png";
import styles from "../../styles/globalStyle";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { getUserProfile } from "../../lib/firestoreService";

const COLORS = {
  background: "#FBF0DD",
  primary: "#61372F",
};

const menubuttons = [
  { id: "1", name: "Home", icon: "home" },
  { id: "2", name: "Adoption Request", icon: "document-text" },
  { id: "3", name: "My Pet", icon: "paw" },
  { id: "4", name: "About", icon: "help-circle" },
  { id: "5", name: "Log-out", icon: "log-out" },
];

const menu = () => {
  const router = useRouter();
  const [username, setUsername] = useState("Guest User");
  const [userEmail, setUserEmail] = useState("");
  const [profileIcon, setProfileIcon] = useState(defaultProfile);
  const [userGender, setUserGender] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      console.log("Current User:", user);

      if (user) {
        // Set user email immediately
        setUserEmail(user.email || "No email found");
        
        try {
          const profile = await getUserProfile(user.uid);
          console.log("Fetched Profile Data:", profile);

          if (profile) {
            // Display username
            if (profile.username) {
              setUsername(profile.username);
            } else {
              const fallbackName = profile.firstname && profile.lastname 
                ? `${profile.firstname} ${profile.lastname}`
                : user.displayName || user.email?.split("@")[0] || `User-${user.uid.substring(0, 6)}`;
              setUsername(fallbackName);
            }
            
            // Set gender for profile icon
            if (profile.gender) {
              setUserGender(profile.gender);
              // Set profile icon based on gender
              if (profile.gender === "Male") {
                setProfileIcon(guyProfile);
              } else if (profile.gender === "Female") {
                setProfileIcon(girlieProfile);
              } else {
                setProfileIcon(defaultProfile);
              }
            } else {
              setProfileIcon(defaultProfile);
            }
          } else {
            console.warn("No profile data found for user.");
            const fallbackName = user.displayName || 
                                 (user.email ? user.email.split("@")[0] : `User-${user.uid.substring(0, 6)}`);
            setUsername(fallbackName);
            setProfileIcon(defaultProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          const fallbackName = user.displayName || 
                               (user.email ? user.email.split("@")[0] : `User-${user.uid.substring(0, 6)}`);
          setUsername(fallbackName);
          setProfileIcon(defaultProfile);
        }
      } else {
        // No user logged in
        setUserEmail("Not logged in");
        setUsername("Guest User");
        setProfileIcon(defaultProfile);
      }
    };

    fetchUserProfile();
  }, []);

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

    if (menuItem.name === "My Pet") {
      router.push("/protected/mypet");
      return;
    }

    if (menuItem.name === "Adoption Request") {
      router.push("/protected/adoptionlist");
      return;
    }

    if (menuItem.name === "Log-out") {
      try {
        await signOut(auth);
        router.replace("/auth/login");
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
  };

  // Navigate to Profile when clicking on the profile section
  const handleProfilePress = () => {
    router.push("/protected/profile");
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
          <TouchableOpacity 
            style={styles.profilecontainer} 
            onPress={handleProfilePress}
            activeOpacity={0.7}
          >
            <Image source={profileIcon} style={styles.imageprofile} />
            <View style={styles.profiletext}>
              <Text style={[styles.bold, { fontSize: 20 }]}>{username}</Text>
              <Text style={{ fontSize: 14, color: COLORS.primary, marginTop: 4 }}>
                {userEmail}
              </Text>
            </View>
          </TouchableOpacity>

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