'use client';

import { auth, db } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { addDoc, collection, doc, setDoc } from "firebase/firestore";

const email = "emailstarter@google.com"

const createUser = (): void => {
   createUserWithEmailAndPassword(auth, email, "password")
   .then((userCredential) => {
     // Signed up
     const user = userCredential.user;
     console.log("Success: User created");

     // Add a new document in collection "Users"
    addDoc(collection(db, "Users"), {
      email: email
    });



   })
   .catch((error) => {
     const errorCode = error.code;
     const errorMessage = error.message;
     console.log( (errorCode), "\n", (errorMessage), "Error, User not created")
   });
};

export default function Home() {
  return (<button onClick={createUser}>Sign Up</button>);
}