/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const user = useMemo(() => {
    return token ? { authenticated: true } : null;
  }, [token]);

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