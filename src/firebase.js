// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLL-yZ9m6vgZ04Yj0x-wDjtxkJOzCiEMc",
  authDomain: "basecamp-app-e6386.firebaseapp.com",
  projectId: "basecamp-app-e6386",
  storageBucket: "basecamp-app-e6386.firebasestorage.app",
  messagingSenderId: "929651436196",
  appId: "1:929651436196:web:790b5001a09d8db991d431",
  measurementId: "G-L0L3JE5SCM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);