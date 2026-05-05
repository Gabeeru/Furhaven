import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

const COLORS = {
  background: "#FBF0DD",
  primary: "#332115",
};

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          router.replace("/auth/login");
          return;
        }

        const profileSnap = await getDoc(doc(db, "users", user.uid));

        if (
          !profileSnap.exists() ||
          profileSnap.data().profileComplete !== true
        ) {
          router.replace("/auth/complete-profile");
          return;
        }
      } catch (error) {
        console.error("Auth guard error:", error);
        router.replace("/auth/login");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.background,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return children;
}
