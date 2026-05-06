import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { getUserProfile } from "../../lib/firestoreService";

// Default images based on pet type
const defaultImages = {
  Dog: require("../../assets/petdefault/dog.png"),
  Cat: require("../../assets/petdefault/cat.png"),
  Bird: require("../../assets/petdefault/bird.png"),
};

export default function AdoptionRequestScreen() {
  const router = useRouter();
  const { petId } = useLocalSearchParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchPetAndUser();
  }, [petId]);

  const fetchPetAndUser = async () => {
    try {
      setLoading(true);
      
      // Fetch pet details
      const petDoc = await getDoc(doc(db, "pets", petId));
      if (petDoc.exists()) {
        setPet({ id: petDoc.id, ...petDoc.data() });
      }

      // Fetch user profile
      const user = auth.currentUser;
      if (user) {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
        
        // Pre-fill form with user data
        setFormData({
          fullName: `${profile?.firstname || ""} ${profile?.lastname || ""}`.trim(),
          email: user.email || "",
          phone: profile?.phone || "",
          address: profile?.address || "",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.fullName.trim()) {
      Alert.alert("Error", "Please enter your full name.");
      return;
    }
    if (!formData.email.trim()) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }
    if (!formData.phone.trim()) {
      Alert.alert("Error", "Please enter your phone number.");
      return;
    }
    if (!formData.address.trim()) {
      Alert.alert("Error", "Please enter your address.");
      return;
    }

    try {
      setSubmitting(true);
      const user = auth.currentUser;
      
      if (!user) {
        Alert.alert("Error", "You must be logged in to submit an adoption request.");
        router.replace("/auth/login");
        return;
      }

      // Create adoption request
      const adoptionRequest = {
        petId: petId,
        petName: pet?.name,
        petType: pet?.type,
        adopterId: user.uid,
        adopterName: formData.fullName,
        adopterEmail: formData.email,
        adopterPhone: formData.phone,
        adopterAddress: formData.address,
        status: "Pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await addDoc(collection(db, "adoptionRequests"), adoptionRequest);

      Alert.alert(
        "Request Submitted",
        "Your adoption request has been submitted successfully! The owner will review your application.",
        [{ text: "OK", onPress: () => router.replace("/protected/dashboard") }]
      );
    } catch (error) {
      console.error("Error submitting adoption request:", error);
      
      // Better error message for permission denied
      if (error.code === "permission-denied") {
        Alert.alert(
          "Permission Error", 
          "Unable to submit adoption request. The adoption request feature needs to be set up by the app owner. Please contact them to enable this feature."
        );
      } else if (error.code === "unavailable") {
        Alert.alert(
          "Network Error", 
          "Unable to connect to the server. Please check your internet connection and try again."
        );
      } else {
        Alert.alert("Error", "Failed to submit adoption request. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Function to get the correct pet image based on type
  const getPetImage = () => {
    if (pet?.image) {
      return { uri: pet.image };
    }
    
    const petType = pet?.type;
    switch (petType) {
      case "Dog":
        return defaultImages.Dog;
      case "Cat":
        return defaultImages.Cat;
      case "Bird":
        return defaultImages.Bird;
      default:
        return defaultImages.Cat; // Default fallback
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#B07D5E" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header - Title only in upper left */}
        <Text style={styles.headerTitle}>Adoption Request</Text>

        {/* Pet Info Card */}
        <View style={styles.petCard}>
          <Image
            source={getPetImage()}
            style={styles.petImage}
            resizeMode="contain"
          />
          <View style={styles.petInfo}>
            <Text style={styles.petName}>{pet?.name}</Text>
            <Text style={styles.petBreed}>{pet?.breed}</Text>
            <Text style={styles.petType}>{pet?.type}</Text>
          </View>
        </View>

        {/* Adoption Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Adoption Application</Text>
          <Text style={styles.formSubtitle}>
            Please fill out this form to request adoption for {pet?.name}
          </Text>

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              placeholder="Enter your full name"
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>

          {/* Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              placeholder="Enter your address"
              multiline
              numberOfLines={2}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={styles.submitButtonText}>
              {submitting ? "Submitting..." : "Submit Adoption Request"}
            </Text>
            <Ionicons name="paw" size={20} color="#FFF" />
          </TouchableOpacity>
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
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FDF2E3",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#332115",
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  petCard: {
    flexDirection: "row",
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
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  petInfo: {
    marginLeft: 15,
    justifyContent: "center",
  },
  petName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#332115",
  },
  petBreed: {
    fontSize: 14,
    color: "#7A6B5D",
    marginTop: 2,
  },
  petType: {
    fontSize: 12,
    color: "#B07D5E",
    marginTop: 2,
  },
  formCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#332115",
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 13,
    color: "#7A6B5D",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#332115",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#FDF2E3",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#332115",
    borderWidth: 1,
    borderColor: "#E8DCC8",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#B07D5E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 10,
    gap: 10,
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
});