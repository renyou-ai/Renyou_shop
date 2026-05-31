import { Routes, Route, Navigate } from "react-router-dom";

import Home           from "@/pages/Home";
import Shop           from "@/pages/Shop";
import ProductDetails from "@/pages/ProductDetails";
import Login          from "@/pages/Login";
import Register       from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword  from "@/pages/ResetPassword";
import Cart           from "@/pages/Cart";
import Checkout       from "@/pages/Checkout";
import Success        from "@/pages/Success";
import Orders         from "@/pages/Orders";
import AdminUsers from "@/pages/admin/AdminUsers";
import ProtectedRoute  from "@/components/ProtectedRoute";
import PublicRoute     from "@/components/PublicRoute";
import AdminRoute      from "@/components/AdminRoute";      // ← NEW
import AiWidget        from "@/components/AiWidget";
import AdminDashboard  from "@/pages/admin/Dashboard";      // ← NEW
import AdminProducts from "@/pages/admin/Products";
import AdminOrders from "@/pages/admin/OrdersAdmin";
import AdminUserDetails from "@/pages/admin/AdminUserDetails";
function App() {
  return (
    <>
      <AiWidget />
      <Routes>

        {/* Redirect */}
        {/* <Route path="/" element={<Navigate to="/home" />} /> */}

        {/* Public */}
        <Route path="/home" element={<Home />} />
        <Route path="/login"          element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register"       element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />

        {/* Protected (users) */}
        <Route path="/shop"        element={<ProtectedRoute><Shop /></ProtectedRoute>} />
        <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
        <Route path="/cart"        element={<Cart />} />
        <Route path="/checkout"    element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/success"     element={<ProtectedRoute><Success /></ProtectedRoute>} />
        <Route path="/orders"      element={<ProtectedRoute><Orders /></ProtectedRoute>} />

        {/* ── ADMIN ── */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={<AdminUsers />}
        />
       <Route
  path="/admin/orders"
  element={
    <AdminRoute>
      <AdminOrders />
    </AdminRoute>
  }
/>
          <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
          <Route
  path="/admin/users/:id"
  element={<AdminUserDetails />}
/>
      </Routes>
    </>
    
  );

}

export default App;