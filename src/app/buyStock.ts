import yahooFinance from "yahoo-finance2";

import { User } from "firebase/auth";

import { db } from "@/firebase";


// Update user documents in Cloud Firestore
import { doc, updateDoc, arrayUnion, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { NoEncryption } from "@mui/icons-material";

const USEAPI = false;


export const buyStock = async (ticker: string, vol: number, user: User, budget: number): Promise<string> => {
  var error = ("Unknown error")
  try {
    if (vol <= 0) {
      return "Volume should be positive"
    }
    var price = 0
    if (USEAPI) {
      const response = await fetch(
      'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=CFLT7E6NIG77NGT0'
      );
    const data = await response.json();
    console.log(data);
    price = parseFloat(data["Global Quote"]["05. price"]);
    }
    else {
      price = 100
    }
    if ((budget - price * vol) < 0) {
      error = "Insufficient Budget"
      return error
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
        }),
        budget: budget - (price * vol)
      })
    }
return "success"

  } catch (err) {
    console.log(err);
    return error
  }
}
