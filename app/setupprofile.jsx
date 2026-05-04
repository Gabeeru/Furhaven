import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const [gender, setGender] = useState("Female");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with Save Button */}
        <View style={styles.topActionRow}>
          <View>
            <Text style={styles.pageTitle}>Profile</Text>
            <Text style={styles.subtitle}>
              Tell us about yourself to build trust with adopters and pet
              owners.
            </Text>
          </View>
          <TouchableOpacity style={styles.saveBtn}>
            <Ionicons name="download-outline" size={18} color="black" />
            <Text style={styles.saveText}>SAVE</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeader}>Basic Information</Text>

        {/* Name Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter name"
            placeholderTextColor="#A0A0A0"
          />
        </View>

        {/* Contact Number Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={[styles.input, { width: "60%" }]}
            placeholder="Enter phone number"
            placeholderTextColor="#A0A0A0"
            keyboardType="phone-pad"
          />
        </View>

        {/* Gender Toggle */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderToggleContainer}>
            <TouchableOpacity
              onPress={() => setGender("Female")}
              style={[
                styles.genderOption,
                gender === "Female" && styles.genderActive,
              ]}
            >
              <Text style={styles.genderText}>Female</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setGender("Male")}
              style={[
                styles.genderOption,
                gender === "Male" && styles.genderActive,
              ]}
            >
              <Text style={styles.genderText}>Male</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Address Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter address"
            placeholderTextColor="#A0A0A0"
          />
        </View>

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, { width: "85%" }]}
            placeholder="Enter email address"
            placeholderTextColor="#A0A0A0"
            keyboardType="email-address"
          />
        </View>

        {/* Disclaimer Section */}
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerTitle}>⚠️ Owner Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            By using this platform, you confirm that the information in your
            profile is accurate and up to date. You are responsible for all pet
            listings you create and for ensuring that the pets are treated with
            proper care and respect. You also agree to communicate honestly with
            potential adopters and to prioritize the safety and well-being of
            the pet at all times.
          </Text>
        </View>

        {/* Rules & Guidelines Section */}
        <View style={styles.guidelinesContainer}>
          <Text style={styles.guidelinesTitle}>
            📜 Owner Rules & Guidelines
          </Text>
          <Text style={styles.guidelinesIntro}>Rules for Pet Owners</Text>

          {[
            "Provide Accurate Information – All details about you and your pet must be truthful and complete.",
            "Humane Treatment – Pets must be cared for properly and must not be neglected or harmed.",
            "Clear Communication – Respond to inquiries respectfully and responsibly.",
            "Real Listings Only – Do not post fake pets, misleading details, or false images.",
            "Safe Meet-Ups – Arrange adoption meetings in safe and appropriate locations.",
            "Respect Privacy – Do not misuse or share other users' personal information.",
          ].map((rule, index) => (
            <Text key={index} style={styles.ruleText}>
              {index + 1}. {rule}
            </Text>
          ))}
        </View>

        {/* Closing Slogan */}
        <Text style={styles.finalNote}>
          Help us create a safe and loving community—your honesty and care can
          change a pet's life.
        </Text>

        {/* Footer Legal Text */}
        <Text style={styles.footerLegal}>
          This profile is provided by the pet owner or lister. Furhaven does not
          independently verify all information shown. Users are responsible for
          confirming details about the pet, including health, behavior, and
          ownership. All communication, agreements, and arrangements made
          through this page are solely between the owner and the interested
          adopter. Furhaven is not liable for any outcomes resulting from these
          interactions. Please proceed responsibly and prioritize the safety and
          well-being of both the pet and all parties involved.
        </Text>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 60,
  },
  topActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 25,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 12,
    color: "#444",
    marginTop: 2,
    maxWidth: "80%",
    lineHeight: 16,
  },
  saveBtn: {
    backgroundColor: "#A3B18A",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveText: {
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 6,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 5,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
    fontSize: 14,
    color: "#000",
  },
  genderToggleContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    height: 42,
    width: "60%",
    overflow: "hidden",
  },
  genderOption: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  genderActive: {
    backgroundColor: "#D9C4A9",
  },
  genderText: {
    fontSize: 14,
    fontWeight: "500",
  },
  disclaimerContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  disclaimerTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 10,
    color: "#333",
    lineHeight: 13,
  },
  guidelinesContainer: {
    marginBottom: 20,
  },
  guidelinesTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 8,
  },
  guidelinesIntro: {
    fontSize: 11,
    fontWeight: "500",
    marginBottom: 6,
  },
  ruleText: {
    fontSize: 10,
    color: "#333",
    marginBottom: 3,
    lineHeight: 13,
  },
  finalNote: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
    lineHeight: 16,
    paddingHorizontal: 30,
  },
  footerLegal: {
    fontSize: 9,
    color: "#555",
    textAlign: "left",
    lineHeight: 11,
  },
});
