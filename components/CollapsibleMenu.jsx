// ...existing code...
import React, { useRef, useState } from "react";
import {
  Animated,
  TouchableOpacity,
  View,
  Text,
  Pressable,
  Platform,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

export default function CollapsibleMenu({ bg = "#FBF0DD" }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    const toValue = open ? 0 : 1;
    Animated.timing(anim, {
      toValue,
      duration: 180,
      useNativeDriver: false,
    }).start(() => {
      setOpen(!open);
    });
  };

  const menuHeight = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 130],
  });

  return (
    <View pointerEvents="box-none" style={styles.wrap}>
      <TouchableOpacity onPress={toggle} style={styles.button}>
        <Text style={styles.btnText}>{open ? "✕" : "☰"}</Text>
      </TouchableOpacity>

      <Animated.View style={[styles.panel, { height: menuHeight }]}>
        <Pressable
          style={styles.item}
          onPress={() => {
            toggle();
            router.push("/welcome");
          }}
        >
          <Text style={styles.text}>Welcome</Text>
        </Pressable>

        <Pressable
          style={styles.item}
          onPress={() => {
            toggle();
            router.push("/dashboard");
          }}
        >
          <Text style={styles.text}>Dashboard</Text>
        </Pressable>

        <Pressable
          style={styles.item}
          onPress={() => {
            toggle();
            router.push("/about");
          }}
        >
          <Text style={styles.text}>About</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    top: Platform.OS === "android" ? 12 : 48,
    left: 12,
    zIndex: 1000,
    alignItems: "flex-start",
  },
  button: {
    backgroundColor: "#A77A59",
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  btnText: { color: "#fff", fontSize: 22, fontWeight: "700" },
  panel: {
    overflow: "hidden",
    width: 160,
    marginTop: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  text: { color: "#0E2347", fontSize: 16 },
});
// ...existing code...
