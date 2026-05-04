import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/globalStyle";
import Bottom_menu from "../components/bottom_menu.jsx";
import PetCard from "../components/PetCard.jsx";

const Dashboard = () => {
  const [text, setText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredPets, setFilteredPets] = useState([]);

  const data = [
    {
      id: "1",
      title: "Dog",
      color: "#FFFFFF",
      icon: require("../assets/dashboard/dog.png"),
    },
    {
      id: "2",
      title: "Cat",
      color: "#FFFFFF",
      icon: require("../assets/dashboard/cat.png"),
    },
    {
      id: "3",
      title: "Others",
      color: "#FFFFFF",
      icon: require("../assets/dashboard/others.png"),
    },
  ];

  const petData = [
    {
      id: "1",
      name: "Gabby",
      gender: "male",
      type: "Cat",
      breed: "Persian Cat",
      age: "2",
      location: "Bonifacio St., Cebu City, Philippines",
    },
    {
      id: "2",
      name: "Dwarde",
      gender: "male",
      type: "Dog",
      breed: "Husky Dog",
      age: "1",
      location: "Basak, Pardo, Cebu, Philippines",
    },
    {
      id: "3",
      name: "Kentoy",
      gender: "male",
      type: "Bird",
      breed: "Blue-and-yellow Macaw Parrot",
      age: "3",
      location: "Day-as, Cebu City, Philippines",
    },
    {
      id: "4",
      name: "Yotnek",
      gender: "male",
      type: "Bird",
      breed: "Blue-and-yellow Macaw Parrot",
      age: "3",
      location: "Day-as, Cebu City, Philippines",
    },
    {
      id: "5",
      name: "KentDward",
      gender: "male",
      type: "Bird",
      breed: "Blue-and-yellow Macaw Parrot",
      age: "3",
      location: "Day-as, Cebu City, Philippines",
    },
    {
      id: "6",
      name: "Selle Buno",
      gender: "female",
      type: "Bird",
      breed: "Blue-and-yellow Macaw Parrot",
      age: "3",
      location: "Day-as, Cebu City, Philippines",
    },
  ];

  //  Combined search + filter logic
  useEffect(() => {
    let filtered = petData;

    const query = text.trim().toLowerCase();

    // Apply search
    if (query.length > 0) {
      filtered = filtered.filter((pet) => {
        return (
          pet.name.toLowerCase().includes(query) ||
          pet.type.toLowerCase().includes(query) ||
          pet.gender.toLowerCase().includes(query)
        );
      });
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (pet) => pet.type.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    setFilteredPets(filtered);
  }, [text, selectedCategory]);

  const handleFilter = (category) => {
    // toggle filter
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
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
                      selectedCategory === item.title ? "#ddd" : item.color,
                  },
                ]}
                onPress={() => handleFilter(item.title)}
              >
                <Image
                  source={item.icon}
                  style={styles.icon}
                  resizeMode="contain"
                />
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
                console.log("Viewing details for:", selectedPet.name)
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
