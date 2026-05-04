import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PetCard = ({ pet, onDelete, onEdit }) => {
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
    <View style={styles.cardContainer}>
      {/* Image Section */}
      <View style={styles.imageWrapper}>
        <View style={styles.imageBackground}>
          <Image
            source={getPetImage(pet)}
            style={styles.petImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.infoCard}>
        <Text style={styles.petName}>{pet.name}</Text>
        <Text style={styles.petBreed}>{pet.breed}</Text>
        <Text
          style={[
            styles.petStatus,
            {
              color: pet.status === "Available" ? "green" : "red",
            },
          ]}
        >
          {pet.status}
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.actionButton, styles.deleteBtn]}
            onPress={() => onDelete?.(pet)}
          >
            <Text style={styles.deleteText}>Delete</Text>
            <Ionicons name="trash-outline" size={16} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.actionButton, styles.editBtn]}
            onPress={() => onEdit?.(pet)}
          >
            <Text style={styles.editText}>Edit</Text>
            <Ionicons name="create-outline" size={16} color="#4A5D23" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PetCard;

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  imageWrapper: {
    zIndex: 10,
    marginRight: -45,
  },
  imageBackground: {
    backgroundColor: "#D9C4A9",
    width: 110,
    height: 110,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  petImage: {
    width: 130,
    height: 150,
    position: "absolute",
    bottom: 0,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "white",
    paddingLeft: 60,
    paddingRight: 15,
    paddingVertical: 20,
    borderRadius: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  petName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  petBreed: {
    color: "#777",
    fontSize: 14,
  },
  petStatus: {
    color: "#000000",
    fontSize: 14,
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: {
    backgroundColor: "#B91C1C",
  },
  editBtn: {
    backgroundColor: "#A3B18A",
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
    marginRight: 5,
    fontSize: 13,
  },
  editText: {
    color: "#4A5D23",
    fontWeight: "bold",
    marginRight: 5,
    fontSize: 13,
  },
});
