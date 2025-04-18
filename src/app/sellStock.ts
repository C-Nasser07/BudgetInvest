import { User } from "firebase/auth";

import { db } from "@/firebase";

import { getStockPrice } from "@/app/getStockPrice";

// Update user documents in Cloud Firestore
import { doc, updateDoc, arrayUnion, collection, query, where, getDocs, Timestamp, arrayRemove } from "firebase/firestore";
import { Trade } from "./trade";

// Complete a specific user's specific trade, returns void
export const sellStock = async (user: User, trades: Trade[], budget: number, tradeIndex: number): Promise<void> => {
  // Store trades to be sold
  const trade = trades[tradeIndex]
  const sellAmount = await getStockPrice(trade.ticker)
  const currentdate = new Date();
  // trade exited now and converted to Firestore Timestamp
  trade.exitPoint = Timestamp.fromDate(currentdate)
  trade.tradeReturn = sellAmount * trade.vol - trade.buyAmount
  const usersRef = collection(db, "Users");
  // Create a query against the collection
  const q = query(usersRef,
    where("email", "==", user.email));
  const querySnapshot = await getDocs(q);
  // doc.data() is never undefined for query doc snapshots
  var id = "";
  // Snapshot contains only one doc
  querySnapshot.forEach((doc) => {
    id = doc.id
    });
    // If document exists, update trades list and budget
    if (id != "") {
      const docref = (doc(db, usersRef.id, id));    
      await updateDoc(docref, {
        trades: trades,
        budget: budget + (sellAmount * trade.vol)
      })
    }
}