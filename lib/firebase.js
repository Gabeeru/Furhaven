// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUWfgj5AI4VOf8fUh5eB4KgaAUx_wG3nI",
  authDomain: "furhaven-5f39f.firebaseapp.com",
  projectId: "furhaven-5f39f",
  storageBucket: "furhaven-5f39f.firebasestorage.app",
  messagingSenderId: "511413271253",
  appId: "1:511413271253:web:d196fac96aff31136f805c",
  measurementId: "G-988XPXT6TB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);

export { db, auth };
