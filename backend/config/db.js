import "dotenv/config";
import {neon} from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL); // creates a SQL connection using databsase URL

export const initDB = async () => {
    try{
        await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY, 
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`;
        console.log("Database connection initialized successfully!");
    } // DECIMAL(10,2) 10 digits in total, and 2 digits after decimal 99999999.99
    catch(e){
        console.log("Error in initializing connection with DB.\nError:",e);
        process.exit(1);
    }
}
