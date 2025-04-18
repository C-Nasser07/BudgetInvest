import { Timestamp } from "firebase/firestore";
// For dev use, when false, uses static test data and preserves API credits
const USEAPI = true;

// Returns current market value of a stock given its ticker
export const getStockPrice = async(ticker: string): Promise<number> => {
  if (USEAPI) {
    const response = await fetch(
    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=CFLT7E6NIG77NGT0`
    );
  const data = await response.json();
  console.log(data);
  // Get current stock price data from API json response
  return (parseFloat(data["Global Quote"]["05. price"]));
  }
  else {
  // Use static test data when USEAPI false 
    return (100)
  }
}
