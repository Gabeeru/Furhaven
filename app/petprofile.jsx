import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PetProfileScreen({ route }) {
  // Assuming you pass the pet data via navigation, or use a static one for now:
  const pet = {
    name: "Brodie",
    breed: "Siamese Cat",
    age: "9 months old",
    gender: "Male",
    location: "Calawisan, Lapu-lapu City, Cebu, Philippines",
    about:
      "Brodie is a gentle and affectionate Siamese cat with striking blue eyes and a calm personality. At 9 months old, he is still playful and curious, enjoying simple activities like chasing toys and exploring cozy corners. Despite his young age, Brodie already shows a sweet and friendly nature, making him easy to bond with.\n\nHe is well-behaved, enjoys human companionship, and gets comfortable quickly in a loving environment. Brodie would be a great companion for individuals or families looking for a calm yet playful pet to brighten their home.",
    image: require("../assets/dashboard/pet1.png"),
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Pet Profile</Text>

        {/* Hero Section: Circular Backdrop and Image */}
        <View style={styles.heroSection}>
          <View style={styles.circleBackdrop} />
          <Image
            source={pet.image}
            style={styles.petHeroImage}
            resizeMode="contain"
          />
        </View>

        {/* Pet Primary Info */}
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
            <Text style={styles.locationText}>{pet.location}</Text>
          </View>
        </View>

        {/* About Card */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>About {pet.name}</Text>
          <Text style={styles.aboutDescription}>{pet.about}</Text>
        </View>

        {/* Adopt Button */}
        <TouchableOpacity style={styles.adoptButton}>
          <Text style={styles.adoptButtonText}>ADOPT</Text>
          <Ionicons
            name="paw"
            size={20}
            color="#5C4033"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
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
    alignItems: "center",
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  heroSection: {
    width: "100%",
    height: 320,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  circleBackdrop: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#C4A484", // Darker tan circle from image
  },
  petHeroImage: {
    width: 300,
    height: 350,
    zIndex: 1,
  },
  headerInfo: {
    alignItems: "center",
    marginBottom: 25,
  },
  petName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000",
  },
  petBreed: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
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
    // Shadow
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
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
  },
  adoptButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5C4033",
  },
});
