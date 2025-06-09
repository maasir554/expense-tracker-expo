import express from "express";
import { deleteTxnById, getTxnsByUserId, getTxnsSummary, postNewTxn } from "../controllers/transactions.js";

const router = express.Router();

// endpoint to get the transactions of a user:

router.get("/:userId", getTxnsByUserId)

// endpoint to record a transaction:
router.post("/", postNewTxn)

//endpoint to delete a transaction:
router.delete("/:txnId", deleteTxnById)

//endpoint to get the summary of a user's expenses:

router.get("/summary/:userId", getTxnsSummary)

export default router;
