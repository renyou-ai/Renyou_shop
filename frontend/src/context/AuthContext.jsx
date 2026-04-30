/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // ✅ récupérer user depuis token
  const getUserFromToken = () => {
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  };

  const user = getUserFromToken();

  const loginUser = (data) => {
    localStorage.setItem("token", data.token);
    setToken(data.token);
  };

  const registerUser = (data) => {
    if (data?.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loginUser,
        registerUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  return useContext(AuthContext);
}