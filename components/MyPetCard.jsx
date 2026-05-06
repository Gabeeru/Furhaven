import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MyPetCard = ({ pet, onDelete, onEdit, onAdopt }) => {
  const defaultImages = {
    cat: require("../assets/petdefault/cat.png"),
    dog: require("../assets/petdefault/dog.png"),
    bird: require("../assets/petdefault/bird.png"),
  };

  const fallbackImage = require("../assets/petdefault/dog.png");

  const getPetImage = () => {
    // for later add uploaded images (URL)
    if (pet.image) return pet.image;

    const type = pet.type?.toLowerCase();
    return defaultImages[type] || fallbackImage;
  };

  const isAvailable = pet.status?.toLowerCase() === "available";

  return (
    <View style={styles.cardContainer}>
      {/* Image Section */}
      <View style={styles.imageWrapper}>
        <View style={styles.imageBackground}>
          <Image
            source={getPetImage()}
            style={styles.petImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Content Card */}
      <View style={styles.infoCard}>
        <View style={styles.textColumn}>
          <Text style={styles.petName}>{pet.name || "Unnamed"}</Text>
          <Text style={styles.petBreed}>{pet.breed || "Unknown breed"}</Text>
          <Text
            style={[
              styles.petStatus,
              { color: isAvailable ? "#16A34A" : "#DC2626" },
            ]}
          >
            {pet.status || "Unknown"}
          </Text>
        </View>

        {/* Action Buttons Column */}
        <View style={styles.buttonColumn}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onAdopt?.(pet)}
            style={[styles.actionBtn, styles.adoptedBtn]}
          >
            <Text style={styles.btnText}>Adopted</Text>
            <Ionicons name="paw" size={12} color="#5C4033" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={() => onDelete?.(pet)}
          >
            <Text style={[styles.btnText, { color: "white" }]}>Delete</Text>
            <Ionicons name="trash" size={12} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.actionBtn, styles.editBtn]}
            onPress={() => onEdit?.(pet)}
          >
            <Text style={styles.btnText}>Edit</Text>
            <Ionicons name="create" size={12} color="#5C4033" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MyPetCard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF2E3" },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  titleSection: { marginBottom: 30 },
  pageTitle: { fontSize: 22, fontWeight: "bold" },
  blueUnderline: {
    height: 3,
    backgroundColor: "#0077B6",
    marginTop: 2,
    width: "40%",
  },
  subtitle: { color: "#444", fontSize: 12, marginTop: 4 },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  imageWrapper: { zIndex: 10, marginRight: -40 },
  imageBackground: {
    backgroundColor: "#D9C4A9",
    width: 100,
    height: 110,
    borderRadius: 15,
  },
  petImage: { width: 110, height: 130, position: "absolute", bottom: 5 },
  infoCard: {
    flex: 1,
    backgroundColor: "white",
    paddingLeft: 50,
    paddingRight: 10,
    paddingVertical: 12,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 3,
  },
  textColumn: { justifyContent: "center", flex: 1 },
  petName: { fontSize: 20, fontWeight: "bold" },
  petBreed: { fontSize: 11, color: "#555" },
  statusLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000",
    marginTop: 2,
  },
  buttonColumn: { gap: 6, width: 85 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    borderRadius: 6,
  },
  btnText: { fontSize: 10, fontWeight: "bold", marginRight: 4 },
  adoptedBtn: { backgroundColor: "#A3B18A" },
  deleteBtn: { backgroundColor: "#B91C1C" },
  editBtn: { backgroundColor: "#B2967D" },
  addPetBox: {
    backgroundColor: "#D9C4A9",
    width: 100,
    height: 100,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  addPetText: { color: "#5C4033", fontWeight: "bold", marginTop: 5 },
});
