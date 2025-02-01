'use client';

import { auth, db } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

// Create a reference to ... collection
import { addDoc, collection, query, where, doc, setDoc, getDocs, or, } from "firebase/firestore";

import { TextField } from "@mui/material";

import { useState } from "react";
import { JoinLeft } from "@mui/icons-material";



const createUser = async (email: string, username: string, password: string): Promise<void> => {
  const usersRef = collection(db, "Users");

  // Create a query against the collection
  const q = query(usersRef,
    or(where("email", "==", email),
    where("username", "==", username)));
  
  // Only execute user creation if no conflicting emails or usernames
  const querySnapshot = await getDocs(q);
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
        addDoc(collection(db, "Users"), {
          email: email,
          username: username,
        });

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log( (errorCode), "\n", (errorMessage), "Error, User not created")
      })
    };
  } else {
    console.log("email or username already in use")
  }
};


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
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
 <div> <button onClick={() => createUser(email, username, password)}>Sign Up ;
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
  id="username"
  label="Username"
  name="username"
  autoFocus
  value={username}
onChange={(e) => setUsername(e.target.value)}
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