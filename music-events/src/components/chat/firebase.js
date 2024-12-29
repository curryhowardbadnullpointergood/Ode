import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB1anHKurd8uwdcyFrnpAxVzptJUENjhoo",
    authDomain: "music-network-e75a1.firebaseapp.com",
    projectId: "music-network-e75a1",
    storageBucket: "music-network-e75a1.firebasestorage.app",
    messagingSenderId: "1074001803261",
    appId: "1:1074001803261:web:3fa4fc230390b54ab98b94",
    measurementId: "G-4XR8D51BNR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app)