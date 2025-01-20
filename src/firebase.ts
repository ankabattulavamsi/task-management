// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';



const firebaseConfig = {
  apiKey: "AIzaSyBa4ZAS9K8Nqz6viGDIeM2TqXJorqU5GAs",
  authDomain: "task-manager-6d1b3.firebaseapp.com",
  projectId: "task-manager-6d1b3",
  storageBucket: "task-manager-6d1b3.firebasestorage.app",
  messagingSenderId: "161547810202",
  appId: "1:161547810202:web:6063b7d4c5f7922cb1b623",
  measurementId: "G-GBV4XZ4TK1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
