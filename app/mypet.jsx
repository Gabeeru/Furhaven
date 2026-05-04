import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MyPetCard from "../components/MyPetCard";
import Bottom_menu from "../components/bottom_menu.jsx";
import { useRouter } from "expo-router";

const petData = [
  {
    id: "1",
    name: "Gabby",
    gender: "male",
    type: "Cat",
    breed: "Persian Cat",
    status: "Unavailable",
    age: "2",
    location: "Bonifacio St., Cebu City, Philippines",
  },
  {
    id: "2",
    name: "Dwarde",
    gender: "male",
    type: "Dog",
    breed: "Husky Dog",
    status: "Available",
    age: "1",
    location: "Basak, Pardo, Cebu, Philippines",
  },
  {
    id: "3",
    name: "Dwarddsade",
    gender: "male",
    type: "Bird",
    breed: "Bird Dog",
    status: "Available",
    age: "1",
    location: "Basak, Pardo, Cebu, Philippines",
  },
];

export default function mypet() {
  const router = useRouter();
  const handleDelete = (pet) => {
    console.log("Delete pet:", pet.name);
  };

  const handleEdit = (pet) => {
    console.log("Edit pet:", pet.name);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <View style={styles.underlineWrapper}>
            <Text style={styles.pageTitle}>My Pets</Text>
            <View style={styles.blueUnderline} />
          </View>
          <Text style={styles.subtitle}>
            View and manage the pets you've listed for adoption.
          </Text>
        </View>

        {/* Pet Cards */}
        {petData.map((item) => (
          <MyPetCard
            key={item.id}
            pet={item}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}

        {/* Add Pet Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.addPetBox}
          onPress={() => router.push("/addpet")}
        >
          <View style={styles.plusIconContainer}>
            <Ionicons name="add" size={32} color="#5C4033" />
          </View>
          <Text style={styles.addPetText}>Add Pet</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
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
