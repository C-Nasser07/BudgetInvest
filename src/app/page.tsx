'use client';

import yahooFinance from "yahoo-finance2";

import { onAuthStateChanged, User } from "firebase/auth";

import { auth, db } from "@/firebase";

import Login from "@/app/login/page";

import { useEffect, useState } from "react";

import Link from "next/link";

// Delete user in Firebase Authentication
import { getAuth, deleteUser } from "firebase/auth";


// Delete user documents in Cloud Firestore
import { doc, deleteDoc, collection, query, where, getDocs, getDoc, Timestamp } from "firebase/firestore";

import {buyStock} from "@/app/buyStock";

import { sellStock } from "@/app/sellStock";

import { getStockPrice } from "@/app/getStockPrice";

import { dividerClasses, TextField } from "@mui/material";

import { Trade } from "@/app/trade";


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
  const [trades, setTrades] = useState< Trade[] >([]);
  const [pnls, setPnls] = useState< Number[] >([]);
  const [budget, setBudget] = useState(0)
  const [errorMessage, seterrorMessage] = useState("")
  const [userId, setUserId] = useState("")
  const [checkButtonState, setCheckButtonState] = useState(false)
  const [share, setShare] = useState("")
  const [otherUsersPnl, setOtherUsersPnl] = useState(0)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setloggedin(user);
      console.log("Success")
  
    });
  }, []);
  useEffect(() => {
    updateFromFirestore()
  }, [user]);

  const buyAndUpdate = async() => {
    if (user) {
      const message = await buyStock(ticker, vol, user, budget);
      seterrorMessage(message);
    }
    updateFromFirestore();
  }

  const sellAndUpdate = async(index: number) => {
    if (user) {
      await sellStock( user, trades, budget, index ); updateFromFirestore()
    }
  }

  const shareGetUserPnl = async (id: string) => {
    if (id != "") {
      const usersRef = collection(db, "Users");
      const docref = (doc(db, usersRef.id, id));
      const docsnap = await getDoc(docref);
      if (docsnap.exists()) {
        const tradeList: Trade[] = docsnap.data() ['trades']
        var total = 0
        await Promise.all(
          tradeList.map(async (trade) => {
            const price = trade.exitPoint ? 0 : await getStockPrice(trade.ticker);
            const profit = price * trade.vol - trade.buyAmount;
            total+= trade.exitPoint? trade.tradeReturn: profit
          })
        );
        setOtherUsersPnl(total)
      }
  }}


  const updateFromFirestore = async () => {
    if (user) {
    // Attempt to find user's document with email
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
      var tradeList: Trade [] = []
      if (id != "") {
        const docref = (doc(db, usersRef.id, id));
        const docsnap = await getDoc(docref);
        if (docsnap.exists()) {
          tradeList = docsnap.data() ['trades']
          // Fills Pnls list with 0
          setPnls(tradeList.map(() => {return 0} ))
          setTrades(tradeList)
          setBudget(docsnap.data() ['budget'])
          setUserId(id)
        }
      }
      console.log(trades)
      const pnls = await Promise.all(
        tradeList.map(async (trade) => {
          const price = trade.exitPoint ? 0 : await getStockPrice(trade.ticker);
          const profit = price * trade.vol - trade.buyAmount;
          return trade.exitPoint? trade.tradeReturn: profit
        })
      );
      console.log(pnls);
      setPnls(pnls);
      // setPnls(trades.map((trade,_) => (
      //   trade.exitPoint?0:(await getStockPrice(trade.ticker)-trade.buyAmount)
      // )))
    }
  }

  if (user) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white shadow-xl rounded-2xl">
  <div className="flex items-center justify-between">
    <h1 className="text-2xl font-semibold text-gray-800">Welcome, {user.email}!</h1>
    <div className="space-x-2">
      {checkButtonState ? (
        <p>
          {userId}
        </p>
      ): (
      <button
        className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
        onClick={() => setCheckButtonState(true) }
      >
        Share
      </button>
    )}
      <Link
        className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
        href="https://www.investopedia.com/trading-basic-education-4689651">
        Learn
        </Link>

      <button
        className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition"
        onClick={() => auth.signOut()}
      >
        Sign Out
      </button>

      <button
        className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
        onClick={() => handledelete(user)}
      >
        Delete User
      </button>
    </div>
  </div>

  <div className="bg-gray-50 p-4 rounded-lg">
    <h2 className="text-lg font-medium text-gray-700">Account Summary</h2>
    <div className="mt-2 space-y-1 text-gray-600">
      <p>Current Budget: <span className="font-semibold">${budget.toFixed(2)}</span></p>
      <p>Budget PnL: $<span className={`font-semibold ${pnls.map(Number).reduce((acc, curr) => acc + curr, 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {pnls.map(Number).reduce((acc, curr) => acc + curr, 0).toFixed(2)}
      </span></p>
    </div>
  </div>

  <div className="bg-gray-50 p-4 rounded-lg">
    <h2 className="text-lg font-medium text-gray-700 mb-2">Current Trades</h2>
    <ul className="space-y-4">
      {trades.map((trade, index) => (
        <li key={index} className="p-4 bg-white shadow rounded-lg">
          <div className="text-gray-700">
            <p>
              <span className="font-medium">{trade.vol}</span> shares of <span className="font-semibold">{trade.ticker+" "}</span> 
              bought at <span className="italic">{trade.entryPoint.toDate().toLocaleString()+" "}</span>
              for <span className="font-medium">${trade.buyAmount.toFixed(2)}</span>
            </p>

            {!trade.exitPoint ? (
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm text-gray-500">P/L: $<span className={`font-semibold ${Number(pnls[index]) >= 0 ? 'text-green-600' : 'text-red-600'}`}>{pnls[index].toFixed(2)}</span></p>
                <button
                  onClick={() => sellAndUpdate(index)}
                  className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition"
                >
                  Sell Stock
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                Exited at {trade.exitPoint.toDate().toLocaleString()}, Return: <span className="font-semibold">{trade.tradeReturn.toFixed(2)}</span>
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  </div>

  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
    <h2 className="text-lg font-medium text-gray-700">Trade Input</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TextField
        id="ticker"
        label="Ticker"
        name="ticker"
        autoFocus
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
        className="w-full"
      />
      <input
        type="number"
        value={vol}
        onChange={(e) => setVol(Number(e.target.value))}
        placeholder="Enter volume"
        className="w-full p-2 border border-gray-300 rounded-lg"
      />
    </div>
    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
  </div>
  <button
        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        onClick={() => buyAndUpdate()}
      >
        Buy Stock
  </button>

    <TextField
          id="share"
          label="share"
          name="share"
          autoFocus
          value={share}
          onChange={(e) => setShare(e.target.value)}
          className="w-full"
    />

    <button
    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
        onClick={() => shareGetUserPnl(share)}
      >
        Get User's PnL
    </button>
    {(otherUsersPnl != 0)
    ?(
    <p className={`font-semibold ${otherUsersPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
      ${otherUsersPnl.toFixed(2)}
    </p>
    ) : (<div></div>)
  }
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
