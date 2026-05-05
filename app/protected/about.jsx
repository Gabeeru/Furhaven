import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import React from "react";
import styles from "../../styles/globalStyle";
import Bottom_menu from "../../components/bottom_menu.jsx";

const coreValues = [
  {
    id: "1",
    icon: require("../../assets/menu/about/find_a_friend.png"),
    title: "Find a Friend",
    description:
      "We partner with verified shelters to make adoption safe and simple.",
  },
  {
    id: "2",
    icon: require("../../assets/menu/about/shop_with_purpose.png"),
    title: "Shop with Purpose",
    description:
      "Every purchase from our shop helps fund shelter operations and pet food.",
  },
  {
    id: "3",
    icon: require("../../assets/menu/about/vetted_quality.png"),
    title: "Vetted Quality",
    description:
      "From chew toys to nutrition, we only stock products we trust for our own pets.",
  },
];

const devs = [
  {
    id: "1",
    pfp: require("../../assets/menu/about/dev1.png"),
    name: "Gabriel Matthew L. Cabije",
    role: "Full Stack Developer",
  },
  {
    id: "2",
    pfp: require("../../assets/menu/about/dev2.png"),
    name: "Roselle F. Durano",
    role: "Full Stack Developer",
  },
];

const About = () => {
  return (
    <View style={localStyles.container}>
      <ScrollView
        contentContainerStyle={localStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View>
          <Text style={styles.label}>About us</Text>
          <Image source={require("../../assets/menu/about/about_header.png")} />
          <Text style={styles.aboutText}>
            At Furhaven, we believe every pet deserves a soft place to land and
            every pet parent deserves the best tools to care for them.
          </Text>
        </View>

        {/* CORE */}
        <Text style={localStyles.sectionTitle}>The Core</Text>

        {coreValues.map((value) => (
          <View key={value.id} style={localStyles.row}>
            <Image source={value.icon} />

            <View style={localStyles.textContainer}>
              <Text style={localStyles.title}>{value.title}</Text>
              <Text style={localStyles.description}>{value.description}</Text>
            </View>
          </View>
        ))}

        {/* DEVELOPERS */}
        <Text style={[localStyles.sectionTitle, { marginTop: 10 }]}>
          The Developers
        </Text>
        <View style={{ marginBottom: 50 }}>
          {devs.map((dev) => (
            <View key={dev.id} style={localStyles.row}>
              <Image source={dev.pfp} />

              <View style={localStyles.textContainer}>
                <Text style={[localStyles.title, localStyles.devName]}>
                  {dev.name}
                </Text>
                <Text style={localStyles.description}>{dev.role}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <Bottom_menu />
    </View>
  );
};

export default About;

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    gap: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  description: {
    flexShrink: 1,
  },
  devName: {
    marginTop: 35,
  },
});
