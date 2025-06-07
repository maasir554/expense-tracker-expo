import express from 'express'
const app = express();

app.listen(5111, ()=>{
    console.log("Server running on PORT 5111\n")
})

app.get("/",(req,res)=>{
    res.send("Hey, its working!! real crazy")
})
