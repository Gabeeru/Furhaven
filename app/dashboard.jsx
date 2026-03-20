import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Text,
  Image,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/globalStyle";
import Bottom_menu from "../components/bottom_menu.jsx";

const Dashboard = () => {
  const [text, setText] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", text);
    // filter/search logic
  };

  const handleFilter = (category) => {
    console.log("Filtering by:", category);
    // filter logic
  };

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
      type: "Cat",
      breed: "Persian Cat",
      age: "2 years",
      location: "Bonifacio St., Cebu City, Philippines",
      image: require("../assets/dashboard/pet1.png"),
    },

    {
      id: "2",
      name: "Dwarde",
      type: "Dog",
      breed: "Husky Dog",
      age: "1 year",
      location: "Basak, Pardo, Cebu, Philippines",
      image: require("../assets/dashboard/pet2.png"),
    },
    {
      id: "3",
      name: "Kentoy",
      type: "Bird",
      breed: "Blue-and-yellow Macaw Parrot",
      age: "3 years",
      location: "Day-as, Cebu City, Philippines",
      image: require("../assets/dashboard/pet3.png"),
    },
    {
      id: "4",
      name: "Yotnek",
      type: "Bird",
      breed: "Blue-and-yellow Macaw Parrot",
      age: "3 years",
      location: "Day-as, Cebu City, Philippines",
      image: require("../assets/dashboard/pet3.png"),
    },
    {
      id: "5",
      name: "KentDward",
      type: "Bird",
      breed: "Blue-and-yellow Macaw Parrot",
      age: "3 years",
      location: "Day-as, Cebu City, Philippines",
      image: require("../assets/dashboard/pet3.png"),
    },
    {
      id: "6",
      name: "Selle Buno",
      type: "Bird",
      breed: "Blue-and-yellow Macaw Parrot",
      age: "3 years",
      location: "Day-as, Cebu City, Philippines",
      image: require("../assets/dashboard/pet3.png"),
    },
  ];

  return (
    <View style={styles.containerdashbrd}>
      {/* // Search Bar */}
      <View style={styles.containersearch}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.input}
            placeholder="Search pets..."
            value={text}
            onChangeText={setText}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
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
                style={[styles.card, { backgroundColor: item.color }]}
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
        {petData.map((pet) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => console.log("Viewing details for:", pet.name)}
            key={pet.id}
            style={styles.petCard}
          >
            {/* Colored Background Square */}
            <View style={styles.imageBackground} />

            {/* Pet Image  */}
            <Image
              source={pet.image}
              style={styles.petImage}
              resizeMode="contain"
            />

            {/* White Info Box */}
            <View style={styles.petInfo}>
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.petBreed}>{pet.breed}</Text>
              <Text style={styles.petAge}>{pet.age} years old</Text>

              <View style={styles.locationRow}>
                <Ionicons name="location" size={14} color="#7B3F21" />
                <Text style={styles.petLocation}>{pet.location}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* end */}

      <Bottom_menu />
    </View>
  );
};

export default Dashboard;
