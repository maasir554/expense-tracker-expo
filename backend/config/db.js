import "dotenv/config";
import {neon} from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL); // creates a SQL connection using databsase URL
