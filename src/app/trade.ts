import { Timestamp } from "firebase/firestore";

export interface Trade {
  ticker: string;
  vol: number;
  entryPoint: Timestamp;
  exitPoint: Timestamp;
  buyAmount: number;
  tradeReturn: number;
}