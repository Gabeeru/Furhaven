import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/globalStyle";

const PetCard = ({ pet, onPress }) => {
  const { name, breed, age, location, image } = pet;

  const defaultImages = {
    cat: require("../assets/petdefault/cat.png"),
    dog: require("../assets/petdefault/dog.png"),
    bird: require("../assets/petdefault/bird.png"),
  };

  const getPetImage = (pet) => {
    const type = pet.type?.toLowerCase();

    return defaultImages[type];
  };
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress(pet)}
      style={styles.petCard}
    >
      {/* Background */}
      <View style={styles.imageBackground} />

      {/* Image */}
      <Image
        source={getPetImage(pet)}
        style={styles.petImage}
        resizeMode="contain"
      />

      {/* Info */}
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{name}</Text>
        <Text style={styles.petBreed}>{breed}</Text>
        <Text style={styles.petGender}>
          {pet.gender?.charAt(0).toUpperCase() + pet.gender?.slice(1)}
        </Text>

        <View style={styles.locationRow}>
          <Ionicons name="location" size={14} color="#7B3F21" />
          <Text style={styles.petLocation}>{location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PetCard;
