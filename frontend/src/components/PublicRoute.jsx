import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { token } = useAuth();

  // If user is already authenticated, redirect away from auth pages
  if (token) {
    return <Navigate to="/shop" replace />;
  }

  return children;
}

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};