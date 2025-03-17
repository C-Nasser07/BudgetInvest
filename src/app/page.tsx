'use client';


import { onAuthStateChanged, User } from "firebase/auth";

import { auth, db } from "@/firebase";

import Login from "@/app/login/page";

import { useEffect, useState } from "react";


// Delete user in Firebase Authentication
import { getAuth, deleteUser } from "firebase/auth";


// Delete user documents in Cloud Firestore
import { doc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";


const handledelete = async (user: User): Promise<void> => {deleteUser(user);
  const usersRef = collection(db, "Users");
  // Create a query against the collection
  const q = query(usersRef,
    where("email", "==", user.email));
  const querySnapshot = await getDocs(q);
    // doc.data() is never undefined for query doc snapshots
  var id = "";
  querySnapshot.forEach((doc) => {
    id = doc.id
    });
    if (id != "") {
     await deleteDoc(doc(db, usersRef.id, id));
    }
}

export default function Home() {
  const [user, setloggedin] = useState<User | null >(null);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setloggedin(user);
      console.log("Success")
    })
  }, []);
  if (user) {
    return (
      <div>
        <h1>Welcome, {user.email}!</h1>
        <button onClick={() => auth.signOut()}>Sign Out</button>
        <button onClick={() => handledelete(user)}> Delete User </button>
      </div>
    );
  }
 
  return (<Login />)
  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     // User is signed in, see docs for a list of available properties
  //     // https://firebase.google.com/docs/reference/js/auth.user
  //     const uid = user.uid;
  //     return (
  //       <p>Home</p>
  //   )
  //     // ...
  //   } else {
  //     return (Login)
  //     // User is signed out
  //     // ...
  //   }
  // });
}
