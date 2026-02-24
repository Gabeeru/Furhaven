import { StyleSheet, Text, View } from "react-native";
import React from "react";

const index = () => {
  return (
    <View style={styles.headerOne}>
      <Text>hi my nigga</Text>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  headerOne: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
