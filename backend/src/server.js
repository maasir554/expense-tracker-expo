import express from 'express'
import dotenv from 'dotenv'
import RateLimiter from './middleware/RateLimiter.js';
import txnRoutes from "./routes/txnRoutes.js"
import { initDB } from './config/db.js';

dotenv.config();
const PORT = process.env.PORT || 5111;

const app = express();
app.use(RateLimiter) // Use the RateLimiter Middleware.
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Status: Working.")
})

app.use("/api/transactions", txnRoutes); // use the transactions routes.

// start the express app only when the database is connected.
initDB().then(
    ()=>{
        app.listen(PORT, ()=>{
            console.log(`Server now running on PORT:${PORT}`)
        })
    }
)
