import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Bottom_menu from "../../components/bottom_menu.jsx";
import { useRouter } from "expo-router";
import { db, auth } from "../../lib/firebase";

import { collection, getDocs } from "firebase/firestore";

export default function AdoptedPetsScreen() {
  const router = useRouter();

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultImages = {
    cat: require("../../assets/petdefault/cat.png"),
    dog: require("../../assets/petdefault/dog.png"),
    bird: require("../../assets/petdefault/bird.png"),
  };

  const getPetImage = (pet) => {
    const type = pet.type?.toLowerCase();

    return defaultImages[type] || defaultImages.dog;
  };

  useEffect(() => {
    const fetchPets = async () => {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const snapshot = await getDocs(collection(db, "pets"));

        const adoptedPets = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(
            (pet) => pet.status === "Adopted" && pet.adoptedBy === user.uid,
          );

        setPets(adoptedPets);
      } catch (error) {
        console.error("Error fetching adopted pets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Adopted Pets</Text>

          <Text style={styles.subtitle}>
            View all pets you have successfully adopted.
          </Text>
        </View>

        {/* Loading */}
        {loading && (
          <Text style={styles.loadingText}>Loading adopted pets...</Text>
        )}

        {/* Empty State */}
        {!loading && pets.length === 0 && (
          <Text style={styles.emptyText}>
            You haven't adopted any pets yet.
          </Text>
        )}

        {/* Pet List */}
        {!loading &&
          pets.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              style={styles.petCard}
            >
              {/* Background Circle */}
              <View style={styles.imageBackground} />

              {/* Pet Image */}
              <Image
                source={getPetImage(item)}
                style={styles.petImage}
                resizeMode="contain"
              />

              {/* Pet Info */}
              <View style={styles.petInfo}>
                <Text style={styles.petName}>{item.name}</Text>

                <Text style={styles.petBreed}>{item.breed}</Text>

                <Text style={styles.petGender}>
                  {item.gender
                    ? item.gender.charAt(0).toUpperCase() + item.gender.slice(1)
                    : "Unknown"}
                </Text>

                <View style={styles.locationRow}>
                  <Ionicons name="location" size={14} color="#7B3F21" />

                  <Text style={styles.petLocation}>
                    {item.address || "Unknown location"}
                  </Text>
                </View>

                {/* Adopted Badge */}
                <View style={styles.adoptedBadge}>
                  <Text style={styles.adoptedText}>Adopted</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

        {/* Browse Pets Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.addPetBox}
          onPress={() => router.push("/protected/dashboard")}
        >
          <View style={styles.plusIconContainer}>
            <Ionicons name="paw" size={30} color="#5C4033" />
          </View>

          <Text style={styles.addPetText}>Browse Pets</Text>
        </TouchableOpacity>
      </ScrollView>

      <Bottom_menu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF2E3",
  },

  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 120,
  },

  titleSection: {
    marginBottom: 35,
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },

  subtitle: {
    color: "#555",
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },

  loadingText: {
    textAlign: "center",
    marginVertical: 20,
    color: "#555",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: "#777",
    fontSize: 15,
  },

  petCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    elevation: 3,
  },

  imageBackground: {
    position: "absolute",
    left: -20,
    // top: -10,
    width: 140,
    height: 200,
    backgroundColor: "#E7D3BE",
    //   borderRadius: 100,
  },

  petImage: {
    width: 95,
    height: 95,
    marginRight: 16,
    zIndex: 2,
  },

  petInfo: {
    flex: 1,
    zIndex: 2,
  },

  petName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3E2C23",
  },

  petBreed: {
    fontSize: 15,
    color: "#555",
    marginTop: 2,
  },

  petGender: {
    fontSize: 14,
    color: "#7B3F21",
    marginTop: 4,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  petLocation: {
    marginLeft: 4,
    color: "#666",
    fontSize: 13,
  },

  adoptedBadge: {
    marginTop: 10,
    backgroundColor: "#D4EDDA",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },

  adoptedText: {
    color: "#155724",
    fontWeight: "bold",
    fontSize: 12,
  },

  addPetBox: {
    backgroundColor: "#D9C4A9",
    width: 140,
    height: 120,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    alignSelf: "center",
  },

  plusIconContainer: {
    borderWidth: 2,
    borderColor: "#5C4033",
    borderRadius: 10,
    padding: 4,
  },

  addPetText: {
    color: "#5C4033",
    fontWeight: "bold",
    marginTop: 8,
    fontSize: 16,
  },
});
