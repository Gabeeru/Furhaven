import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";

export default function PetProfileScreen() {
  const { petId } = useLocalSearchParams();
  const router = useRouter();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  const defaultImages = {
    dog: require("../../assets/petdefault/dog.png"),
    cat: require("../../assets/petdefault/cat.png"),
    bird: require("../../assets/petdefault/bird.png"),
  };

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const docRef = doc(db, "pets", petId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const petData = { id: docSnap.id, ...docSnap.data() };
          setPet(petData);
          
          // Check if current user is the owner
          const currentUser = auth.currentUser;
          if (currentUser && petData.ownerId === currentUser.uid) {
            setIsOwner(true);
          }
        } else {
          setPet(null);
        }
      } catch (error) {
        console.error("Error fetching pet:", error);
      } finally {
        setLoading(false);
      }
    };

    if (petId) fetchPet();
  }, [petId]);

  const handleAdoptPress = () => {
    if (!auth.currentUser) {
      Alert.alert("Login Required", "Please login to submit an adoption request.", [
        { text: "Cancel", style: "cancel" },
        { text: "Login", onPress: () => router.push("/auth/login") }
      ]);
      return;
    }

    // Navigate to adoption request form
    router.push(`/protected/adoptionrequest?petId=${pet.id}`);
  };

  const handleViewRequests = () => {
    router.push({
      pathname: "/protected/adoptionlist",
      params: { petId: pet.id, petName: pet.name }
    });
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#5C4033" />
      </View>
    );
  }

  if (!pet) {
    return (
      <View style={styles.loader}>
        <Text>Pet not found</Text>
      </View>
    );
  }

  const isAvailable = pet.status?.toLowerCase() === "available";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header - Title only in upper left */}
        <Text style={styles.headerTitle}>Pet Profile</Text>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.circleBackdrop} />

          <Image
            source={
              pet.image
                ? { uri: pet.image }
                : defaultImages[pet.type?.toLowerCase()] ||
                  require("../../assets/petdefault/cat.png")
            }
            style={styles.petHeroImage}
            resizeMode="contain"
          />
        </View>

        {/* Info */}
        <View style={styles.headerInfo}>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={styles.petBreed}>{pet.breed}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{pet.age}</Text>
            <View style={styles.divider} />
            <Text style={styles.metaText}>{pet.gender}</Text>
          </View>

          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color="#8B4513" />
            <Text style={styles.locationText}>{pet.address}</Text>
          </View>
        </View>

        {/* About */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>About {pet.name}</Text>
          <Text style={styles.aboutDescription}>
            {pet.about || "No description provided."}
          </Text>
        </View>

        {/* Action Button - Changes based on user role */}
        {isOwner ? (
          <TouchableOpacity 
            style={styles.viewRequestsButton}
            onPress={handleViewRequests}
          >
            <Ionicons name="document-text" size={20} color="#FFF" />
            <Text style={styles.viewRequestsButtonText}>View Adoption Requests</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.adoptButton, !isAvailable && styles.disabledButton]}
            onPress={handleAdoptPress}
            disabled={!isAvailable}
          >
            <Text style={styles.adoptButtonText}>
              {isAvailable ? "ADOPT" : "UNAVAILABLE"}
            </Text>
            <Ionicons name="paw" size={20} color="#5C4033" />
          </TouchableOpacity>
        )}

        {/* Show message if pet is adopted */}
        {!isAvailable && !isOwner && (
          <Text style={styles.adoptedMessage}>
            This pet has already been adopted. Check out other pets!
          </Text>
        )}
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
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 10,
    paddingBottom: 40,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#332115",
    alignSelf: "flex-start",
    marginBottom: 20,
    marginTop: 10,
  },
  heroSection: {
    width: "100%",
    height: 320,
    justifyContent: "center",
    alignItems: "center",
  },
  circleBackdrop: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 140,
    backgroundColor: "#C4A484",
  },
  petHeroImage: {
    width: 300,
    height: 280,
    zIndex: 1,
  },
  headerInfo: {
    alignItems: "center",
    marginBottom: 25,
  },
  petName: {
    fontSize: 32,
    fontWeight: "bold",
  },
  petBreed: {
    fontSize: 16,
    color: "#333",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  metaText: {
    fontSize: 12,
    color: "#555",
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: "#000",
    marginHorizontal: 10,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  locationText: {
    fontSize: 11,
    color: "#555",
    marginLeft: 4,
  },
  aboutCard: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  aboutDescription: {
    fontSize: 13,
    color: "#333",
    lineHeight: 18,
  },
  adoptButton: {
    backgroundColor: "#A3B18A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "70%",
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  adoptButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5C4033",
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: "#9E9E9E",
  },
  viewRequestsButton: {
    backgroundColor: "#B07D5E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  viewRequestsButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  adoptedMessage: {
    marginTop: 16,
    fontSize: 12,
    color: "#DC2626",
    textAlign: "center",
  },
});