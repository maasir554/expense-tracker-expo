import { sql } from "../config/db.js";

export const getTxnsByUserId = async (req,res)=>{
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
}

export const postNewTxn = async (req,res) => {
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
}

export const deleteTxnById = async (req,res)=>{
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
};

export const getTxnsSummary = async (req,res)=>{
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
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expense: expenseResult[0].expense
        });

    }catch(e){
        console.log("Error at endpoint: /api/transactions/sumary/", e);
        res.status(500).json({message:"Internal server error."});
    }
}


