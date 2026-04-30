import { Routes, Route, Navigate } from "react-router-dom";

import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetails from "@/pages/ProductDetails";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Success from "@/pages/Success";
import Orders from "@/pages/Orders";

import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import AiWidget from "@/components/AiWidget";

function App() {
  return (
    <>
      <AiWidget />

      <Routes>

        {/* redirect */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* public */}
        <Route path="/home" element={<Home />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/reset-password/:token"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        {/* protected */}
        <Route
          path="/shop"
          element={
            <ProtectedRoute>
              <Shop />
            </ProtectedRoute>
          }
        />

        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          }
        />

        <Route path="/cart" element={<Cart />} />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        {/* 🔥 IMPORTANT */}
        <Route
          path="/success"
          element={
            <ProtectedRoute>
              <Success />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
}

export default App;