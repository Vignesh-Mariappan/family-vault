

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABmPRybsLJU0xNO_JDuNG7U1hA_VVSWJU",
  authDomain: "familyvault-a0403.firebaseapp.com",
  projectId: "familyvault-a0403",
  storageBucket: "familyvault-a0403.firebasestorage.app",
  // storageBucket: "familyvault-a0403.appspot.com",
  messagingSenderId: "587021240696",
  appId: "1:587021240696:web:d651bdc919c408f9e3608d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
