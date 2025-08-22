// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvUMnqfBOQ_1WrK6WGM_r3AGMf15RAVQI",
  authDomain: "studioai-980a7.firebaseapp.com",
  projectId: "studioai-980a7",
  storageBucket: "studioai-980a7.firebasestorage.app",
  messagingSenderId: "216158155286",
  appId: "1:216158155286:web:9767f4000f7b43c7877b37",
  measurementId: "G-SGLQ2TMFGN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
