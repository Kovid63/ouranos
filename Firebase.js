// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { initializeFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB7NXc5VWvgrJMq7TTPBwTDFilcWYZ4WHg",
  authDomain: "company-test-bd5f9.firebaseapp.com",
  projectId: "company-test-bd5f9",
  storageBucket: "company-test-bd5f9.appspot.com",
  messagingSenderId: "621228318034",
  appId: "1:621228318034:web:07499832668c8a3a002e8b",
  measurementId: "G-4Q48V4PES6"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, {experimentalForceLongPolling: true,})
const storage = getStorage(app)

export {auth, db, storage}