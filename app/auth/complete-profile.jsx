import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import styles from "../../styles/globalStyle";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { signOut } from "firebase/auth";

const COLORS = {
  background: "#FBF0DD",
  primary: "#332115",
  secondary: "#B07D5E",
  accent: "#2D1D13",
  white: "#FFFFFF",
};

const completeProfile = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    phone: "",
    address: "",
    gender: "",
    dateOfBirth: new Date(2000, 0, 1),
  });

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError("Username is required.");
      return false;
    }
    if (!formData.firstname.trim()) {
      setError("First name is required.");
      return false;
    }
    if (!formData.lastname.trim()) {
      setError("Last name is required.");
      return false;
    }
    if (!formData.phone.trim()) {
      setError("Phone number is required.");
      return false;
    }
    if (!formData.address.trim()) {
      setError("Address is required.");
      return false;
    }
    if (!formData.gender) {
      setError("Please select a gender.");
      return false;
    }
    return true;
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, dateOfBirth: selectedDate });
    }
  };

  const handleCompleteProfile = async () => {
    setError("");

    if (!validateForm()) return;

    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user) {
        setError("User not authenticated. Please try again.");
        return;
      }

      // Save profile data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        username: formData.username,
        firstname: formData.firstname,
        lastname: formData.lastname,
        phone: formData.phone,
        address: formData.address,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        profileComplete: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("Profile saved successfully");
      Alert.alert("Success", "Profile completed successfully!", [
        { text: "OK", onPress: () => router.push("/protected/dashboard") },
      ]);
    } catch (error) {
      console.error("Error saving profile:", error);
      setError("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //signout
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/auth/login");
    } catch (error) {
      console.error("Sign out error:", error);
      setError("Failed to sign out. Please try again.");
    }
  };

  return (
    <ScrollView style={{ backgroundColor: COLORS.background, flex: 1 }}>
      <View style={styles.innerContainer}>
        <Text style={styles.loginText}>COMPLETE PROFILE</Text>
        {error ? (
          <Text style={{ color: "red", marginBottom: 10, textAlign: "center" }}>
            {error}
          </Text>
        ) : null}

        <View style={styles.formContainer}>
          {/* Username */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.textInputs}
              placeholder="Enter username"
              value={formData.username}
              onChangeText={(text) =>
                setFormData({ ...formData, username: text })
              }
              editable={!loading}
            />
          </View>

          {/* First Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.textInputs}
              placeholder="Enter first name"
              value={formData.firstname}
              onChangeText={(text) =>
                setFormData({ ...formData, firstname: text })
              }
              editable={!loading}
            />
          </View>

          {/* Last Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.textInputs}
              placeholder="Enter last name"
              value={formData.lastname}
              onChangeText={(text) =>
                setFormData({ ...formData, lastname: text })
              }
              editable={!loading}
            />
          </View>

          {/* Phone Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.textInputs}
              placeholder="Enter phone number"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
              editable={!loading}
            />
          </View>

          {/* Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.textInputs, { height: 60 }]}
              placeholder="Enter address"
              value={formData.address}
              onChangeText={(text) =>
                setFormData({ ...formData, address: text })
              }
              multiline
              editable={!loading}
            />
          </View>

          {/* Gender */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              {["Male", "Female", "Other"].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  onPress={() => setFormData({ ...formData, gender })}
                  style={[
                    { padding: 10, borderRadius: 5, borderWidth: 2 },
                    formData.gender === gender
                      ? {
                          borderColor: COLORS.secondary,
                          backgroundColor: COLORS.secondary,
                        }
                      : { borderColor: COLORS.primary },
                  ]}
                >
                  <Text
                    style={{
                      color:
                        formData.gender === gender
                          ? COLORS.white
                          : COLORS.primary,
                    }}
                  >
                    {gender}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date of Birth */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={[styles.textInputs, { justifyContent: "center" }]}
            >
              <Text>{formData.dateOfBirth.toLocaleDateString()}</Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={formData.dateOfBirth}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.getStartedBtn,
            loading && { opacity: 0.5 },
            { flexDirection: "row" },
          ]}
          onPress={handleCompleteProfile}
          disabled={loading}
        >
          <Text style={styles.getStartedText}>
            {loading ? "Saving..." : "Complete Profile"}
          </Text>
          <FontAwesome5
            name="paw"
            size={16}
            color={COLORS.accent}
            style={styles.paw}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.getStartedBtn,
            { marginTop: 12, backgroundColor: "#6B4A3D" },
            { flexDirection: "row" },
          ]}
          onPress={handleSignOut}
          disabled={loading}
        >
          <Text style={styles.getStartedText}>Sign Out</Text>
          <FontAwesome5
            name="sign-out-alt"
            size={16}
            color={COLORS.accent}
            style={styles.paw}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default completeProfile;
