import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token } = useAuth();

  // If user is not authenticated, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};