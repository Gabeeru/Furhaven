import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "expo-router";
import { auth } from "../../lib/firebase";
import { Picker } from "@react-native-picker/picker";

export default function AddPetScreen() {
  const [gender, setGender] = useState("Female");
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");
  const [type, setType] = useState("");
  const [age, setAge] = useState("");
  const [about, setAbout] = useState("");
  const [address, setAddress] = useState("");
  const router = useRouter();

  const addPet = async () => {
    if (!petName.trim()) {
      Alert.alert("Validation", "Please enter the pet name.");
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Not signed in", "Please log in first.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "pets"), {
        ownerId: user.uid,
        ownerEmail: user.email || null,
        name: petName,
        breed,
        type,
        gender,
        age,
        about,
        address,
        status: "Available",
        createdAt: serverTimestamp(),
        adoptedBy: null,
      });
      Alert.alert("Success", "Pet added successfully!");
      router.replace("/protected/mypet");
    } catch (error) {
      console.error("Error adding pet:", error);
      Alert.alert("Error", error.message || "Failed to add pet.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with Save Button */}
        <View style={styles.topActionRow}>
          <View>
            <Text style={styles.pageTitle}>Add Pet</Text>
            <Text style={styles.subtitle}>
              Fill in the details below to help your pet find a loving home.
            </Text>
          </View>
          <TouchableOpacity style={styles.saveBtn} onPress={addPet}>
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
            value={petName}
            onChangeText={setPetName}
          />
        </View>

        {/* Breed and Type Row */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1.5, marginRight: 10 }]}>
            <Text style={styles.label}>Breed</Text>
            <TextInput
              style={styles.input}
              placeholder="Specify breed"
              placeholderTextColor="#A0A0A0"
              value={breed}
              onChangeText={setBreed}
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Type</Text>

            <View style={styles.input}>
              <Picker
                selectedValue={type}
                onValueChange={(itemValue) => setType(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select Type" value="" />
                <Picker.Item label="Dog" value="Dog" />
                <Picker.Item label="Cat" value="Cat" />
                <Picker.Item label="Bird" value="Bird" />
              </Picker>
            </View>
          </View>
        </View>

        {/* Gender and Age Row */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1.2, marginRight: 10 }]}>
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
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Years"
              placeholderTextColor="#A0A0A0"
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
            />
          </View>
        </View>

        {/* About Pet Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>About Pet</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe personality, behavior, and special traits..."
            placeholderTextColor="#A0A0A0"
            multiline={true}
            numberOfLines={4}
            value={about}
            onChangeText={setAbout}
          />
        </View>

        {/* Address Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter address"
            placeholderTextColor="#A0A0A0"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {/* Rules and Guidelines Section */}
        <View style={styles.guidelinesContainer}>
          <Text style={styles.guidelinesTitle}>📜 Rules & Guidelines</Text>
          <Text style={styles.guidelinesIntro}>
            To keep Furhaven safe and trustworthy, please follow these rules:
          </Text>

          {[
            "Adoption Only – This platform is strictly for pet adoption. Selling pets for profit is not allowed.",
            "Accurate Information – Provide honest and complete details about the pet's condition, behavior, and history.",
            "Animal Welfare First – Pets must be treated humanely and must be ready for safe rehoming.",
            "No Harmful Content – Listings involving abuse, neglect, or illegal activities will be removed immediately.",
            "Respectful Communication – Be respectful and responsible when interacting with other users.",
            "Real Photos Only – Upload clear and actual photos of the pet. Misleading images are not allowed.",
            "One Pet per Listing – Each post should represent only one pet to avoid confusion.",
          ].map((rule, index) => (
            <Text key={index} style={styles.ruleText}>
              {index + 1}. {rule}
            </Text>
          ))}

          <Text style={styles.finalNote}>
            Help us create a safe and loving community—your honesty and care can
            change a pet's life.
          </Text>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  topActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 25,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 12,
    color: "#444",
    marginTop: 2,
    maxWidth: "75%",
  },
  saveBtn: {
    backgroundColor: "#A3B18A",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  saveText: {
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 5,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 14,
    color: "#000",
  },
  row: {
    flexDirection: "row",
  },
  genderToggleContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    height: 40,
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
    fontSize: 13,
    fontWeight: "500",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 10,
  },
  guidelinesContainer: {
    marginTop: 20,
  },
  guidelinesTitle: {
    fontSize: 11,
    fontWeight: "bold",
  },
  guidelinesIntro: {
    fontSize: 10,
    fontWeight: "500",
    marginBottom: 5,
  },
  ruleText: {
    fontSize: 9,
    color: "#333",
    marginBottom: 2,
    lineHeight: 12,
  },
  finalNote: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    lineHeight: 16,
    paddingHorizontal: 20,
  },
  dropdown: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    height: 40,
    justifyContent: "center",
    overflow: "hidden",
  },

  dropdownPicker: {
    height: 40,
    color: "#000",
    width: "100%",
  },
});
