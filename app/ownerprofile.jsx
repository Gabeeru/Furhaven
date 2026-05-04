import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import profile from "../assets/menu/default_profile.png";

export default function OwnerProfileScreen() {
  // Static data based on your image
  const owner = {
    name: "Gabriel Cabije",
    location: "Buagsong, Cordova, Cebu City, Philippines",
    contact: "0991 570 6585",
    email: "gabb@gmail.com",
    // Replace with your actual local asset path
    avatar: profile,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <Text style={styles.pageTitle}>Owner Profile</Text>

        {/* Avatar Section */}
        <View style={styles.avatarContainer}>
          <View style={styles.blueBackdrop} />
          <Image
            source={owner.avatar}
            style={styles.avatarImage}
            resizeMode="contain"
          />
        </View>

        {/* Name and Location */}
        <View style={styles.centerInfo}>
          <Text style={styles.ownerName}>{owner.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color="#8B4513" />
            <Text style={styles.locationText}>{owner.location}</Text>
          </View>
        </View>

        {/* Contact Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>Contact Number</Text>
          <Text style={styles.detailValue}>{owner.contact}</Text>

          <Text style={styles.detailLabel}>Email Address</Text>
          <Text style={styles.detailValue}>{owner.email}</Text>
        </View>

        {/* Disclaimer Section */}
        <View style={styles.legalSection}>
          <Text style={styles.legalHeader}>⚠️ Owner Disclaimer</Text>
          <Text style={styles.legalText}>
            This profile is provided by the pet owner or lister. Furhaven does
            not independently verify all information shown. Users are
            responsible for confirming details about the pet, including health,
            behavior, and ownership.{"\n"}
            All communication, agreements, and arrangements made through this
            page are solely between the owner and the interested adopter.
            Furhaven is not liable for any outcomes resulting from these
            interactions.{"\n"}
            Please proceed responsibly and prioritize the safety and well-being
            of both the pet and all parties involved.
          </Text>
        </View>

        {/* Rules Section */}
        <View style={styles.legalSection}>
          <Text style={styles.legalHeader}>📜 Owner Rules & Guidelines</Text>
          <Text style={styles.rulesIntro}>
            Before contacting the owner, please follow these guidelines:
          </Text>

          {[
            "Be Respectful – Communicate politely and clearly when reaching out to the owner.",
            "Verify Information – Ask questions and confirm important details about the pet before making decisions.",
            "No Harmful Intent – Adoption should always prioritize the pet's safety and well-being.",
            "Safe Meet-Ups – Arrange meetings in secure, public, and appropriate locations.",
            "No Illegal Activity – Any form of abuse, exploitation, or unlawful behavior is strictly prohibited.",
            "Protect Your Privacy – Avoid sharing sensitive personal or financial information unnecessarily.",
            "Report Issues – If you encounter suspicious behavior, report it immediately.",
          ].map((rule, index) => (
            <Text key={index} style={styles.ruleText}>
              {index + 1}. {rule}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF2E3",
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 10,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 280,
    marginBottom: 10,
  },
  blueBackdrop: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#8ECAE6", // Matches the blue circle in the image
  },
  avatarImage: {
    width: 240,
    height: 240,
    zIndex: 1,
  },
  centerInfo: {
    alignItems: "center",
    marginBottom: 25,
  },
  ownerName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  locationText: {
    fontSize: 11,
    color: "#555",
    marginLeft: 4,
  },
  detailsContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginTop: 15,
  },
  detailValue: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
  },
  legalSection: {
    marginBottom: 20,
  },
  legalHeader: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  legalText: {
    fontSize: 9,
    color: "#333",
    lineHeight: 11,
  },
  rulesIntro: {
    fontSize: 10,
    fontWeight: "600",
    marginBottom: 5,
  },
  ruleText: {
    fontSize: 9,
    color: "#333",
    marginBottom: 2,
    lineHeight: 11,
  },
});
