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
    } // DECIMAL(10,2) 10 digits in total, and 2 digits after decimal 99999999.99
    catch(e){
        console.log("Error in initializing connection with DB.\nError:",e);
        process.exit(1);
    }
}

const app = express();
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Hey, its working!! real crazy")
})

app.post("/api/transactions", async (req,res) => {
    try{
        const {title, amount, category, user_id} = req.body;
        
        if(!title || !amount || ! category || !user_id) 
        return res.status(400).json({message:"All fileds are required."});
        
        const transaction = await sql`
            INSERT INTO transactions(user_id,title,amount,category)
            VALUES(${user_id},${title},${amount},${category})
            RETURNING *
        `
        console.log(transaction);
        res.status(201).json(transaction[0]); // actually the sql function is gonna return a list of created values
        // we know that there's gonna be a single entry as we prompted for.
    }
    catch(err){
        console.log("Error in /api/transactions: ", err);
        res.status(500).json({message: "Internal srver error.", endpoint:"/api/transactions"})
    }
})

// start the express app only when the database is connected.
initDB().then(
    ()=>{
        app.listen(PORT, ()=>{
            console.log(`Server now running on PORT:${PORT}`)
        })
    }
)
