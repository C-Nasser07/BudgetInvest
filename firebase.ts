// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQGXg9AFlZoFdMlSG8H7BhYlo7tLxYFb0",
  authDomain: "budgetinvest-76bac.firebaseapp.com",
  projectId: "budgetinvest-76bac",
  storageBucket: "budgetinvest-76bac.firebasestorage.app",
  messagingSenderId: "1067207739874",
  appId: "1:1067207739874:web:696fa30c52dae0439611bb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
export {auth, db};