import { createContext } from "react";
import Database from "@/database/db";

/** @ts-ignore */
const databaseContext = createContext<Database>();

export default databaseContext;
