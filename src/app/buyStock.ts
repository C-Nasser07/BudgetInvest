import yahooFinance from "yahoo-finance2";

import { User } from "firebase/auth";

import { db } from "@/firebase";


// Update user documents in Cloud Firestore
import { doc, updateDoc, arrayUnion, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { NoEncryption } from "@mui/icons-material";

const USEAPI = false;


export const buyStock = async (ticker: string, vol: number, user: User): Promise<void> => {
  try {
    if (USEAPI) {
      const response = await fetch(
      'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=CFLT7E6NIG77NGT0'
      );
    const data = await response.json();
    console.log(data);
    const price = parseFloat(data["Global Quote"]["05. price"]);
    }
    else {
      const price = 100
    }
    
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
      const currentdate = new Date();
      await updateDoc(docref, {
        trades : arrayUnion({
          ticker : ticker,
          vol : vol,
          entryPoint : Timestamp.fromDate(currentdate),
          exitPoint : null
        })
      })
    }

  } catch (err) {
    console.log(err);
  }
}
