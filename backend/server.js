const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb://127.0.0.1:27017/renyou")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err))

const productRoutes = require("./src/routes/productRoutes")

app.use("/api/products", productRoutes)

app.get("/api", (req,res)=>{
  res.json({message:"API running"})
})

app.listen(5000, ()=>{
  console.log("Server running on port 5000")
})