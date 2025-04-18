import yahooFinance from "yahoo-finance2";

import { User } from "firebase/auth";

import { db } from "@/firebase";


import { doc, updateDoc, arrayUnion, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { NoEncryption } from "@mui/icons-material";
import { getStockPrice } from "./getStockPrice";

// Purchases vol shares of a stock given its ticker for a specific user, and given their budget.
// Returns success or error message
export const buyStock = async (ticker: string, vol: number, user: User, budget: number): Promise<string> => {
  var error = ("Unknown error")
  try {
    if (vol <= 0) {
      return "Volume should be positive"
    }
    var price = await getStockPrice(ticker);
    // 1% Commission fee for added realism
    price+=price*0.01
    // Returns error message if user has insufficient budget
    if ((budget - price * vol) < 0) {
      error = "Insufficient Budget"
      return error
    }

    const usersRef = collection(db, "Users");
    // Create a query against the collection
    const q = query(usersRef,
      where("email", "==", user.email));
    // Execute query to get snapshot from Firestore
    const querySnapshot = await getDocs(q);
    // doc.data() is never undefined for query doc snapshots
    var id = "";
    // Snapshot will only contain one doc
    querySnapshot.forEach((doc) => {
      id = doc.id
      }
    );
    // If document exists
    if (id != "") {
      const docref = (doc(db, usersRef.id, id));
      // Get current Timestamp to be stored in trade entryPoint
      const currentdate = new Date();
      // Add new trade to trades list in Firestore
      await updateDoc(docref, {
        trades: arrayUnion({
          ticker: ticker,
          vol: vol,
          entryPoint: Timestamp.fromDate(currentdate),
          exitPoint: null,
          buyAmount: price * vol,
          tradeReturn: null
        }),
        budget: budget - (price * vol)
      })
    }
    // If no error, return success
    return "success"
  } catch (err) {
    console.log(err);
    // If unexpected error, return error message
    return error
  }
}
