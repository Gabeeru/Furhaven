import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../../lib/firebase";
import { getUserProfile, updateUserProfile } from "../../lib/firestoreService";
import defaultProfile from "../../assets/menu/default_profile.png";
import guyProfile from "../../assets/profile/guy.png";
import girlieProfile from "../../assets/profile/girlie.png";

export default function OwnerProfileScreen() {
  const [owner, setOwner] = useState({
    firstname: "",
    lastname: "",
    address: "",
    phone: "",
    email: "",
    gender: "",
  });
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    firstname: "",
    lastname: "",
    address: "",
    phone: "",
    gender: "",
  });

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const fetchOwnerData = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      
      if (!user) {
        console.log("No user logged in");
        setOwner({
          firstname: "Guest",
          lastname: "User",
          address: "Not available",
          phone: "Not available",
          email: "Not logged in",
          gender: "",
        });
        setLoading(false);
        return;
      }

      const userProfile = await getUserProfile(user.uid);
      console.log("Owner Profile Data:", userProfile);

      if (userProfile) {
        setOwner({
          firstname: userProfile.firstname || "",
          lastname: userProfile.lastname || "",
          address: userProfile.address || "Not provided",
          phone: userProfile.phone || "Not provided",
          email: user.email || "No email found",
          gender: userProfile.gender || "",
        });
        setEditForm({
          firstname: userProfile.firstname || "",
          lastname: userProfile.lastname || "",
          address: userProfile.address || "",
          phone: userProfile.phone || "",
          gender: userProfile.gender || "",
        });
      } else {
        setOwner({
          firstname: user.displayName?.split(" ")[0] || "User",
          lastname: user.displayName?.split(" ")[1] || "",
          address: "Not provided",
          phone: "Not provided",
          email: user.email || "No email found",
          gender: "",
        });
      }
    } catch (error) {
      console.error("Error fetching owner data:", error);
      setOwner({
        firstname: "Error",
        lastname: "Loading",
        address: "Unable to load",
        phone: "Unable to load",
        email: "Unable to load",
        gender: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setEditLoading(true);
      const user = auth.currentUser;
      
      if (!user) {
        Alert.alert("Error", "No user logged in");
        return;
      }

      await updateUserProfile(user.uid, {
        firstname: editForm.firstname,
        lastname: editForm.lastname,
        address: editForm.address,
        phone: editForm.phone,
        gender: editForm.gender,
        updatedAt: new Date(),
      });

      setOwner({
        ...owner,
        firstname: editForm.firstname,
        lastname: editForm.lastname,
        address: editForm.address,
        phone: editForm.phone,
        gender: editForm.gender,
      });

      Alert.alert("Success", "Profile updated successfully!");
      setModalVisible(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setEditLoading(false);
    }
  };

  const openEditModal = () => {
    setEditForm({
      firstname: owner.firstname,
      lastname: owner.lastname,
      address: owner.address,
      phone: owner.phone,
      gender: owner.gender,
    });
    setModalVisible(true);
  };

  // Function to get the correct profile icon based on gender
  const getProfileIcon = () => {
    if (owner.gender === "Male") {
      return guyProfile;
    } else if (owner.gender === "Female") {
      return girlieProfile;
    } else {
      return defaultProfile;
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#B07D5E" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Profile Title in Upper Left and Edit Icon on Right */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.editButton} onPress={openEditModal}>
            <Ionicons name="create-outline" size={28} color="#B07D5E" />
          </TouchableOpacity>
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarGradient} />
            <Image source={getProfileIcon()} style={styles.avatarImage} />
          </View>
        </View>

        {/* Name */}
        <Text style={styles.name}>
          {owner.firstname} {owner.lastname}
        </Text>

        {/* Location Badge */}
        <View style={styles.locationBadge}>
          <Ionicons name="location-outline" size={16} color="#B07D5E" />
          <Text style={styles.locationText}>{owner.address}</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="call-outline" size={24} color="#B07D5E" />
            <Text style={styles.statLabel}>Contact</Text>
            <Text style={styles.statValue}>{owner.phone}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Ionicons name="mail-outline" size={24} color="#B07D5E" />
            <Text style={styles.statLabel}>Email</Text>
            <Text style={styles.statValue}>{owner.email}</Text>
          </View>
        </View>

        {/* Info Cards */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="document-text-outline" size={22} color="#B07D5E" />
            <Text style={styles.infoTitle}>About Owner</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={18} color="#B07D5E" />
            <Text style={styles.infoText}>
              Pet lover and responsible owner
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color="#B07D5E" />
            <Text style={styles.infoText}>
              Member since {new Date().getFullYear()}
            </Text>
          </View>
        </View>

        {/* Disclaimer Section */}
        <View style={styles.disclaimerCard}>
          <View style={styles.disclaimerHeader}>
            <Ionicons name="alert-circle-outline" size={20} color="#D4835A" />
            <Text style={styles.disclaimerTitle}>Owner Disclaimer</Text>
          </View>
          <Text style={styles.disclaimerText}>
            This profile is provided by the pet owner or lister. Furhaven does
            not independently verify all information shown. Users are
            responsible for confirming details about the pet, including health,
            behavior, and ownership.
          </Text>
        </View>

        {/* Rules Section */}
        <View style={styles.rulesCard}>
          <View style={styles.rulesHeader}>
            <Ionicons name="book-outline" size={20} color="#D4835A" />
            <Text style={styles.rulesTitle}>Owner Rules & Guidelines</Text>
          </View>
          <Text style={styles.rulesSubtitle}>
            Before contacting the owner, please follow these guidelines:
          </Text>
          {[
            "Be Respectful – Communicate politely and clearly",
            "Verify Information – Confirm pet details before decisions",
            "No Harmful Intent – Prioritize pet's safety and well-being",
            "Safe Meet-Ups – Arrange meetings in secure locations",
            "Protect Your Privacy – Avoid sharing sensitive information",
            "Report Issues – Report suspicious behavior immediately",
          ].map((rule, index) => (
            <View key={index} style={styles.ruleItem}>
              <View style={styles.ruleNumber}>
                <Text style={styles.ruleNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.ruleText}>{rule}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#332115" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalContent}>
                <Text style={styles.inputLabel}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.firstname}
                  onChangeText={(text) => setEditForm({...editForm, firstname: text})}
                  placeholder="Enter first name"
                  placeholderTextColor="#999"
                />

                <Text style={styles.inputLabel}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.lastname}
                  onChangeText={(text) => setEditForm({...editForm, lastname: text})}
                  placeholder="Enter last name"
                  placeholderTextColor="#999"
                />

                <Text style={styles.inputLabel}>Gender</Text>
                <View style={styles.genderContainer}>
                  <TouchableOpacity
                    style={[
                      styles.genderOption,
                      editForm.gender === "Male" && styles.genderOptionSelected
                    ]}
                    onPress={() => setEditForm({...editForm, gender: "Male"})}
                  >
                    <Text style={[
                      styles.genderText,
                      editForm.gender === "Male" && styles.genderTextSelected
                    ]}>Male</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.genderOption,
                      editForm.gender === "Female" && styles.genderOptionSelected
                    ]}
                    onPress={() => setEditForm({...editForm, gender: "Female"})}
                  >
                    <Text style={[
                      styles.genderText,
                      editForm.gender === "Female" && styles.genderTextSelected
                    ]}>Female</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.genderOption,
                      editForm.gender === "Other" && styles.genderOptionSelected
                    ]}
                    onPress={() => setEditForm({...editForm, gender: "Other"})}
                  >
                    <Text style={[
                      styles.genderText,
                      editForm.gender === "Other" && styles.genderTextSelected
                    ]}>Other</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.inputLabel}>Address</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={editForm.address}
                  onChangeText={(text) => setEditForm({...editForm, address: text})}
                  placeholder="Enter address"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={3}
                />

                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.phone}
                  onChangeText={(text) => setEditForm({...editForm, phone: text})}
                  placeholder="Enter phone number"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleUpdateProfile}
                    disabled={editLoading}
                  >
                    <Text style={styles.saveButtonText}>
                      {editLoading ? "Saving..." : "Save Changes"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF0DD",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#B07D5E",
    fontSize: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#332115",
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarSection: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  avatarWrapper: {
    position: "relative",
  },
  
  avatarImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#FFF",
  },
  name: {
    fontSize: 28,
    fontWeight: "700",
    color: "#332115",
    textAlign: "center",
    marginBottom: 8,
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  locationText: {
    fontSize: 13,
    color: "#7A6B5D",
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E8DCC8",
  },
  statLabel: {
    fontSize: 12,
    color: "#7A6B5D",
    marginTop: 6,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#332115",
  },
  infoCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#332115",
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#7A6B5D",
    marginLeft: 10,
  },
  disclaimerCard: {
    backgroundColor: "#FFF9F0",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#D4835A",
  },
  disclaimerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  disclaimerTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#D4835A",
    marginLeft: 6,
  },
  disclaimerText: {
    fontSize: 10,
    color: "#7A6B5D",
    lineHeight: 14,
  },
  rulesCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  rulesHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  rulesTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#332115",
    marginLeft: 8,
  },
  rulesSubtitle: {
    fontSize: 11,
    color: "#7A6B5D",
    marginBottom: 14,
    marginTop: 4,
  },
  ruleItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  ruleNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#B07D5E",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 2,
  },
  ruleNumberText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFF",
  },
  ruleText: {
    flex: 1,
    fontSize: 11,
    color: "#7A6B5D",
    lineHeight: 16,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    width: "90%",
    maxHeight: "80%",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E8DCC8",
    paddingBottom: 15,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#332115",
  },
  modalContent: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#332115",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#FDF2E3",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#332115",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E8DCC8",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  genderOption: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E8DCC8",
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#FDF2E3",
  },
  genderOptionSelected: {
    backgroundColor: "#B07D5E",
    borderColor: "#B07D5E",
  },
  genderText: {
    fontSize: 14,
    color: "#332115",
  },
  genderTextSelected: {
    color: "#FFF",
    fontWeight: "600",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#FDF2E3",
    borderWidth: 1,
    borderColor: "#E8DCC8",
  },
  saveButton: {
    backgroundColor: "#B07D5E",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#332115",
    fontWeight: "600",
  },
  saveButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "600",
  },
});