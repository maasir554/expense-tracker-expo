import express from 'express'
import dotenv from 'dotenv'
import { sql } from './config/db.js';
dotenv.config();
const PORT = process.env.PORT || 5111;

const initDB = async () => {
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
    }
    catch(e){
        console.log("Error in initializing connection with DB.\nError:",e);
        process.exit(1);
    }
}

const app = express();

app.get("/",(req,res)=>{
    res.send("Hey, its working!! real crazy")
})

// start the express app only when the database is connected.
initDB().then(
    ()=>{
        app.listen(PORT, ()=>{
            console.log(`Server now running on PORT:${PORT}`)
        })
    }
)
