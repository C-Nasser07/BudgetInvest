'use client';

import { auth, db } from "@/firebase";

import { signInWithEmailAndPassword } from "firebase/auth";


function LoginUser() {
  signInWithEmailAndPassword(auth, "pojimmydoer@google.com", "DoDo!12345").then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log("Logged in", user.email)
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log("Error, User not logged in", errorCode, errorMessage)
  });
}


export default function Login() {
  return (
    <button onClick={() =>LoginUser() }>Login
  </button>
)
}