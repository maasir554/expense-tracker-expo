import express from 'express'
import dotenv from 'dotenv'
import { sql } from './config/db.js';
import RateLimiter from './middleware/RateLimiter.js';
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
app.use(RateLimiter) // Use the RateLimiter Middleware.
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Hey, its working!! real crazy")
})

// endpoint to get the transactions of a user:

app.get("/api/transactions/:userId", async (req,res)=>{
    try{
        const {userId} = req.params;
        const details = await sql`
            SELECT * FROM transactions WHERE(user_id=${userId}) 
            ORDER BY created_at DESC
        `;
        res.status(200).json(details)
    }
    catch(err){
        console.log("Error in getting the transaction details", err);
        res.status(500).json({message:"Internal server error"});
    }
})

// endpoint to record a transaction:
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

//endpoint to delete a transaction:
app.delete("/api/transactions/:txnId", async (req,res)=>{
    try{     
        const { txnId } = req.params;
        if(isNaN(parseInt(txnId))) return res.status(404).json({message:"transaction ID is invalid. "})
        const result = await sql`
            DELETE FROM transactions WHERE id = ${txnId}
            RETURNING *
        `
        if(result.length == 0) return res.status(404).json({message:"Transaction not found."});
        res.status(200).json({message:"Transaction deleted successfully"});
    }
    catch(err){
        console.log("Error in deleting a transaction.", err);
        res.status(500).json({message:"Internal server error at DELETE transaction."})
    }
})

//endpoint to get the summary of a user's expenses:

app.get("/api/transactions/summary/:userId", async (req,res)=>{
    try{
        const {userId} = req.params;
        
        const balanceResult = await sql`
            SELECT COALESCE(SUM(amount),0) AS balance 
            FROM transactions WHERE user_id=${userId}
        `;
        
        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount),0) AS income 
            FROM transactions WHERE user_id=${userId}
            AND amount>0
        `;
        
        const expenseResult = await sql`
            SELECT COALESCE(SUM(amount),0) AS expense 
            FROM transactions WHERE user_id=${userId}
            AND amount<0
        `;
        
        res.status(200).json({
            balance: balanceResult,
            income: incomeResult,
            expense: expenseResult
        });

    }catch(e){
        console.log("Error at endpoint: /api/transactions/sumary/", e);
        res.status(500).json({message:"Internal server error."});
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
