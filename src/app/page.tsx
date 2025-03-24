'use client';

import yahooFinance from "yahoo-finance2";

import { onAuthStateChanged, User } from "firebase/auth";

import { auth, db } from "@/firebase";

import Login from "@/app/login/page";

import { useEffect, useState } from "react";


// Delete user in Firebase Authentication
import { getAuth, deleteUser } from "firebase/auth";


// Delete user documents in Cloud Firestore
import { doc, deleteDoc, collection, query, where, getDocs, getDoc, Timestamp } from "firebase/firestore";


import {buyStock} from "@/app/buyStock"
import { TextField } from "@mui/material";


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

  const [ticker, setTicker] = useState("");
  const [vol, setVol] = useState(0);
  const [trades, setTrades] = useState<{ ticker: string; vol: number; entryPoint: Timestamp }[]>([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setloggedin(user);
      console.log("Success")
  
    });
  }, []);
  useEffect(() => {
    getAllTrades()
  }, [user]);

  const makeTrade = () => {
    if (user) {
      buyStock(ticker, vol, user)
    }
    getAllTrades();
  }
  const getAllTrades = async () => {
    if (user) {
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
          const docref = (doc(db, usersRef.id, id));
          const docsnap = await getDoc(docref);
          if (docsnap.exists()) {
            setTrades(docsnap.data() ['trades'])
          }
        }
      }
  }

  if (user) {
    return (
      <div>
        <h1>Welcome, {user.email}!</h1>
        <div className="mt-4">
        <h2>Current Trades:</h2>
        <ul>
          {trades.map((trade, index) => (
            <li key={index}>
              {trade.vol} shares of {trade.ticker} at
              {trade.entryPoint.toDate().toLocaleString()}
            </li>
          ))}
        </ul>
      </div>

        <TextField
        id="ticker"
        label="Ticker"
        name="ticker"
        autoFocus
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
        />

        <input
        type="vol"
        value={vol}
        onChange={(e) => setVol(Number(e.target.value))}
        placeholder="Enter volume"
        className="mb-4 p-2 border border-gray-300 rounded"
        />

        <button onClick={() => makeTrade()}> Buy Stock </button>
        <button onClick={() => auth.signOut()}> Sign Out </button>
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
