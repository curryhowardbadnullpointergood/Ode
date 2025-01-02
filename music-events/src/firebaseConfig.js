import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyA3LSf3sYRzfcWXycl_ivRCu_UJ7kV0NCU",
    authDomain: "music-event-app-442810.firebaseapp.com",
    projectId: "music-event-app-442810",
    storageBucket: "music-event-app-442810.firebasestorage.app",
    messagingSenderId: "568353778562",
    appId: "1:568353778562:web:a26e1e897848d3052a7d9b",
    measurementId: "G-FHXQXYSKWJ"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig, 'your app name here');
//export const auth = getAuth();
export const storage = getStorage(app);
//export const db = getFirestore(app)