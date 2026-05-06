import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../styles/globalStyle";
import Bottom_menu from "../../components/bottom_menu.jsx";
import PetCard from "../../components/PetCard.jsx";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { auth } from "../../lib/firebase";
import { useRouter } from "expo-router";

const Dashboard = () => {
  const [text, setText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const router = useRouter();

  const data = [
    { id: "1", title: "Dog", icon: require("../../assets/dashboard/dog.png") },
    { id: "2", title: "Cat", icon: require("../../assets/dashboard/cat.png") },
    {
      id: "3",
      title: "Bird",
      icon: require("../../assets/dashboard/bird.png"),
    },
  ];

  // Fetch pets ONCE (only available pets)
  useEffect(() => {
    const fetchPets = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const snapshot = await getDocs(collection(db, "pets"));

        const list = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((pet) => pet.status === "Available"); // 👈 FILTER HERE

        setPets(list);
        setFilteredPets(list);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    fetchPets();
  }, []);
  // Filter logic
  useEffect(() => {
    let filtered = pets;

    const searchQuery = text.trim().toLowerCase();

    if (searchQuery.length > 0) {
      filtered = filtered.filter((pet) => {
        return (
          pet.name?.toLowerCase().includes(searchQuery) ||
          pet.type?.toLowerCase().includes(searchQuery) ||
          pet.gender?.toLowerCase().includes(searchQuery)
        );
      });
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (pet) => pet.type?.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    setFilteredPets(filtered);
  }, [text, selectedCategory, pets]);

  //  Category toggle
  const handleFilter = (category) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };

  return (
    <View style={styles.containerdashbrd}>
      {/* Search Bar */}
      <View style={styles.containersearch}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.input}
            placeholder="Search pets..."
            value={text}
            onChangeText={setText}
          />
        </View>

        <TouchableOpacity style={styles.button}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View>
        <Text style={styles.label}>Categories</Text>
        <View style={styles.rowcateg}>
          {data.map((item) => (
            <View style={styles.itemContainer} key={item.id}>
              <TouchableOpacity
                style={[
                  styles.card,
                  {
                    backgroundColor:
                      selectedCategory === item.title ? "#ddd" : "#fff",
                  },
                ]}
                onPress={() => handleFilter(item.title)}
              >
                <Image source={item.icon} style={styles.icon} />
              </TouchableOpacity>
              <Text style={styles.itemLabel}>{item.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Explore */}
      <Text style={styles.label}>Explore</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredPets.length > 0 ? (
          filteredPets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onPress={(selectedPet) =>
                router.push({
                  pathname: "/protected/petprofile",
                  params: { petId: pet.id },
                })
              }
            />
          ))
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No pets found
          </Text>
        )}
      </ScrollView>

      <Bottom_menu />
    </View>
  );
};

export default Dashboard;
