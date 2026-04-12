const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

/* Middlewares */

app.use(cors());
app.use(express.json());

/* Mongo connection */

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/renyou";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

/* Routes */

const productRoutes = require("./src/routes/productRoutes");
const authRoutes = require("./src/routes/authRoutes"); // ✅ AJOUT

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes); // ✅ AJOUT

/* Test route */

app.get("/api", (req, res) => {
  res.json({ message: "API running" });
});

/* Start server */

app.listen(5000, () => {
  console.log("Server running on port 5000");
});