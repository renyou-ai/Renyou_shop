require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

/* ======================
   🔥 CORS (FIX COMPLET)
====================== */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

/* ======================
   ⚠️ STRIPE WEBHOOK (RAW BODY)
   DOIT ÊTRE AVANT express.json()
====================== */
app.use(
  "/api/orders/webhook",
  express.raw({ type: "application/json" })
);

/* ======================
   ✅ JSON MIDDLEWARE
====================== */
app.use(express.json());

/* ======================
   📦 ROUTES
====================== */
const productRoutes = require("./src/routes/productRoutes");
const authRoutes = require("./src/routes/authRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const orderRoutes = require("./src/routes/orderRoutes");

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

/* ======================
   🌐 TEST ROUTE
====================== */
app.get("/api", (req, res) => {
  res.json({ message: "API running" });
});

/* ======================
   🗄️ DATABASE
====================== */
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/renyou";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo error:", err));

/* ======================
   🚀 START SERVER
====================== */
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});