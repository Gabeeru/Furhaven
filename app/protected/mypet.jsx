import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MyPetCard from "../../components/MyPetCard";
import Bottom_menu from "../../components/bottom_menu.jsx";
import { useRouter } from "expo-router";
import { db, auth } from "../../lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

export default function MyPetScreen() {
  const router = useRouter();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPets = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return [];

      const q = query(collection(db, "pets"), where("ownerId", "==", user.uid));

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return data;
    } catch (error) {
      console.error("Error fetching pets:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      const data = await getPets();
      setPets(data);
      setLoading(false);
    };

    fetchPets();
  }, []);
  const handleAdopt = async (pet) => {
    try {
      const petRef = doc(db, "pets", pet.id);

      await updateDoc(petRef, {
        status: "Adopted",
      });

      Alert.alert("Updated", `${pet.name} marked as adopted`);

      // Refresh list
      const updatedPets = await getPets();
      setPets(updatedPets);
    } catch (error) {
      console.error("Error updating status:", error);
      Alert.alert("Error", "Failed to update pet.");
    }
  };

  const handleDelete = async (pet) => {
    try {
      const petRef = doc(db, "pets", pet.id);

      await deleteDoc(petRef);

      Alert.alert("Deleted", `${pet.name} removed`);

      // Refresh list
      const updatedPets = await getPets();
      setPets(updatedPets);
    } catch (error) {
      console.error("Error deleting pet:", error);
      Alert.alert("Error", "Failed to delete pet.");
    }
  };

  const handleEdit = (pet) => {
    router.push({
      pathname: "/protected/editpet",
      params: { petId: pet.id },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>My Pets</Text>
          <Text style={styles.subtitle}>
            View and manage the pets you've listed for adoption.
          </Text>
        </View>

        {/* Loading state */}
        {loading && (
          <Text style={{ textAlign: "center", marginVertical: 20 }}>
            Loading pets...
          </Text>
        )}

        {/* Pet list */}
        {!loading &&
          pets.map((item) => (
            <MyPetCard
              key={item.id}
              pet={item}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onAdopt={handleAdopt}
            />
          ))}

        {/* Add Pet */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.addPetBox}
          onPress={() => router.push("/protected/addpet")}
        >
          <View style={styles.plusIconContainer}>
            <Ionicons name="add" size={32} color="#5C4033" />
          </View>
          <Text style={styles.addPetText}>Add Pet</Text>
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
  underlineWrapper: {
    alignSelf: "flex-start",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
  blueUnderline: {
    height: 4,
    backgroundColor: "#0077B6",
    marginTop: 2,
    width: "85%",
  },
  subtitle: {
    color: "#555",
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },
  addPetBox: {
    backgroundColor: "#D9C4A9",
    width: 120,
    height: 120,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  plusIconContainer: {
    borderWidth: 2,
    borderColor: "#5C4033",
    borderRadius: 10,
    padding: 0,
  },
  addPetText: {
    color: "#5C4033",
    fontWeight: "bold",
    marginTop: 5,
    fontSize: 16,
  },
});
