'use client';

import { auth, db } from "@/firebase";

import { signInWithEmailAndPassword } from "firebase/auth";

import Link from "next/link";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign In</h2>

        <TextField
          id="email"
          label="Email Address"
          name="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          id="password"
          label="Password"
          name="password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={() => LoginUser(email, password)}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Sign In
        </button>

        <p className="text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}