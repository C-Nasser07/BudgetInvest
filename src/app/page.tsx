'use client';

import { auth } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const createUser = (): void => {
   createUserWithEmailAndPassword(auth, "", "password")
   .then((userCredential) => {
     // Signed up
     const user = userCredential.user;
     console.log("Success: User created")
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