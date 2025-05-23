'use client';

import { auth, db } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { addDoc, collection, query, where, doc, setDoc, getDocs, or, } from "firebase/firestore";

import Link from "next/link";

import { TextField } from "@mui/material";

import { useState } from "react";
import { JoinLeft } from "@mui/icons-material";

import { Trade } from "@/app/trade";

// Create a user in Firestore with their email, username, and starting budget, returns void
const addTheDoc = async (email: string, username: string, budget: Number): Promise<void> => {
  // Add a new document in collection "Users"
  await addDoc(collection(db, "Users"), {
    email: email.toLowerCase(),
    username: username,
    budget: budget,
    trades: []
  });
}
// Creates a user in Authentication using email and password and calls addTheDoc, returns void
const createUser = async (email: string, username: string, password: string, budget: Number): Promise<void> => {
  const usersRef = collection(db, "Users");

  // Create a query against the collection
  const q = query(usersRef,
    or(where("email", "==", email),
    where("username", "==", username)));
  
  const querySnapshot = await getDocs(q);
  // Only execute user creation if no conflicting emails or usernames
  if (querySnapshot.empty) {

    // Only execute user creation if password is secure
    const validationErrors = validatePassword(password);
    if (validationErrors.length > 0) {
      console.log("Password validation failed:", validationErrors);
    } else {
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log("Success: User created");

        // Add a new document in collection "Users"
        addTheDoc(email, username, budget);

      })
      .catch((error) => {
        // If error creating user in Authentication, log error code and error message
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log( (errorCode), "\n", (errorMessage), "Error, User not created")
      })
    };
  } else {
    console.log("email or username already in use")
  }
};

// Takes in password and returns list of potential validation errors
function validatePassword(password: string): string[] {
  const errors: string[] = [];

  // Minimum length of 8 characters
  if ((password.length < 6) || (password.length > 15)) {
    errors.push("Password must be between 6 and 15 characters long.");
  }

  // At least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter.");
  }

  // At least one lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter.");
  }

  // At least one digit
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one digit.");
  }
  
  return errors;
}

export default function Home() {
  // State variables
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [budget, setBudget] = useState(100000);
  // React page layout
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>

        <TextField
          id="email"
          label="Email Address"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          id="username"
          label="Username"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          id="password"
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <p className="text-sm text-gray-600">
          Starting Budget
        </p>
        <input
          type="number"
          id="budget"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          placeholder="Enter Starting Budget"
          className="w-full p-2 border border-gray-300 rounded-lg"
        />

        <button
          onClick={() => createUser(email, username, password, budget)}
          className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Sign Up
        </button>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}