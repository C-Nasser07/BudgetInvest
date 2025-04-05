import { Timestamp } from "firebase/firestore";

const USEAPI = true;


export const getStockPrice = async(ticker: string): Promise<number> => {
  if (USEAPI) {
    const response = await fetch(
    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=CFLT7E6NIG77NGT0`
    );
  const data = await response.json();
  console.log(data);
  return (parseFloat(data["Global Quote"]["05. price"]));
  }
  else {
    return (100)
  }
}