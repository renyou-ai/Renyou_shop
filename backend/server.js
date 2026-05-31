require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* ======================
   📦 ROUTES IMPORTS
====================== */
const productRoutes = require("./src/routes/productRoutes");
const authRoutes = require("./src/routes/authRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const adminUsersRoutes = require("./src/routes/adminUsers.routes");

/* 🔥 CATEGORY ROUTES */
const categoryRoutes = require("./src/routes/categoryRoutes");

/* ======================
   🔥 CORS
====================== */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

/* ======================
   ⚠️ STRIPE WEBHOOK
====================== */
app.use(
  "/api/orders/webhook",
  express.raw({
    type: "application/json",
  })
);

/* ======================
   ✅ JSON PARSER
====================== */
app.use(express.json());

/* ======================
   📦 API ROUTES
====================== */

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/cart",
  cartRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

/* 🔥 ADMIN DASHBOARD */
app.use(
  "/api/admin",
  adminRoutes
);

/* 🔥 ADMIN USERS */
app.use(
  "/api/admin/users",
  adminUsersRoutes
);

/* 🔥 CATEGORIES */
app.use(
  "/api/categories",
  categoryRoutes
);

/* ======================
   🌐 TEST ROUTE
====================== */
app.get("/api", (req, res) => {

  res.json({
    message: "API running",
  });
});

/* ======================
   ❌ 404 HANDLER
====================== */
app.use((req, res) => {

  res.status(404).json({
    message: "Route not found",
  });
});

/* ======================
   🗄️ DATABASE
====================== */
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/renyou";

mongoose
  .connect(MONGO_URI)
  .then(() => {

    console.log(
      "✅ MongoDB connected"
    );
  })
  .catch((err) => {

    console.error(
      "❌ Mongo error:",
      err
    );
  });

/* ======================
   🚀 START SERVER
====================== */
const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );
});