import React, { useEffect, useState } from "react";
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
import { useLocalSearchParams, useRouter } from "expo-router";
import { db } from "../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Picker } from "@react-native-picker/picker";

export default function EditPet() {
  const { petId } = useLocalSearchParams();
  const router = useRouter();

  // STATES
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [gender, setGender] = useState("Female");
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");
  const [type, setType] = useState("");
  const [age, setAge] = useState("");
  const [about, setAbout] = useState("");
  const [address, setAddress] = useState("");

  // FETCH PET DATA
  useEffect(() => {
    const fetchPet = async () => {
      try {
        const docRef = doc(db, "pets", petId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setPetName(data.name || "");
          setBreed(data.breed || "");
          setType(data.type || "");
          setGender(data.gender || "Female");
          setAge(data.age || "");
          setAbout(data.about || "");
          setAddress(data.address || "");
        } else {
          Alert.alert("Error", "Pet not found.");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        Alert.alert("Error", "Failed to load pet.");
      } finally {
        setLoading(false);
      }
    };

    if (petId) fetchPet();
  }, [petId]);

  // UPDATE PET
  const handleUpdate = async () => {
    if (!petName.trim()) {
      Alert.alert("Validation", "Please enter the pet name.");
      return;
    }

    try {
      setUpdating(true);

      const docRef = doc(db, "pets", petId);

      await updateDoc(docRef, {
        name: petName,
        breed,
        type,
        gender,
        age,
        about,
        address,
      });

      Alert.alert("Success", "Pet updated successfully!");
      router.replace("/protected/mypet");
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Failed to update pet.");
    } finally {
      setUpdating(false);
    }
  };

  // LOADING SCREEN
  if (loading) {
    return (
      <View style={styles.loader}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEADER */}
        <View style={styles.topActionRow}>
          <View>
            <Text style={styles.pageTitle}>Edit Pet</Text>
            <Text style={styles.subtitle}>Update your pet's information.</Text>
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, updating && { opacity: 0.6 }]}
            onPress={handleUpdate}
            disabled={updating}
          >
            <Ionicons name="save-outline" size={18} color="black" />
            <Text style={styles.saveText}>
              {updating ? "UPDATING..." : "UPDATE"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* NAME */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={petName}
            onChangeText={setPetName}
            editable={!updating}
          />
        </View>

        {/* BREED + TYPE */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1.5, marginRight: 10 }]}>
            <Text style={styles.label}>Breed</Text>
            <TextInput
              style={styles.input}
              value={breed}
              onChangeText={setBreed}
              editable={!updating}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.input}>
              <Picker
                selectedValue={type}
                onValueChange={(val) => setType(val)}
                enabled={!updating}
              >
                <Picker.Item label="Select Type" value="" />
                <Picker.Item label="Dog" value="Dog" />
                <Picker.Item label="Cat" value="Cat" />
                <Picker.Item label="Bird" value="Bird" />
              </Picker>
            </View>
          </View>
        </View>

        {/* GENDER + AGE */}
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
                disabled={updating}
              >
                <Text>Female</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setGender("Male")}
                style={[
                  styles.genderOption,
                  gender === "Male" && styles.genderActive,
                ]}
                disabled={updating}
              >
                <Text>Male</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              editable={!updating}
            />
          </View>
        </View>

        {/* ABOUT */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>About</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={about}
            onChangeText={setAbout}
            multiline
            editable={!updating}
          />
        </View>

        {/* ADDRESS */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            editable={!updating}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF2E3",
  },
  scrollContent: {
    padding: 20,
  },
  topActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
    color: "#555",
  },
  saveBtn: {
    flexDirection: "row",
    backgroundColor: "#A3B18A",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  saveText: {
    marginLeft: 5,
    fontWeight: "bold",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  row: {
    flexDirection: "row",
  },
  genderToggleContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    overflow: "hidden",
  },
  genderOption: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  genderActive: {
    backgroundColor: "#D9C4A9",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
