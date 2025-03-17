'use client';

import { auth, db } from "@/firebase";

import { signInWithEmailAndPassword } from "firebase/auth";

import { TextField } from "@mui/material";

import { useState } from "react";
import { JoinLeft } from "@mui/icons-material";


const LoginUser = async (email: string, password: string): Promise<void> => {
  signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
 <div> <button onClick={() => LoginUser(email, password)}>Sign In ;
  </button>

 <TextField
  id="email"
  label="Email Address"
  name="email"
  autoFocus
  value={email}
onChange={(e) => setEmail(e.target.value)}
/>

<TextField
  id="password"
  label="Password"
  name="password"
  type="password"
  autoFocus
  value={password}
onChange={(e) => setPassword(e.target.value)}
/>
</div>
)
}