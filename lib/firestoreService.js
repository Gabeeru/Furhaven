import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

// Check if user profile is complete
export const checkProfileComplete = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data().profileComplete || false;
    }
    return false;
  } catch (error) {
    console.error("Error checking profile:", error);
    return false;
  }
};

// Get user profile data
export const getUserProfile = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (uid, data) => {
  try {
    await updateDoc(doc(db, "users", uid), {
      ...data,
      updatedAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error("Error updating profile:", error);
    return false;
  }
};
