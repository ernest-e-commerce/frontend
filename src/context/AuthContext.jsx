import React, { createContext, useContext, useState, useEffect } from "react";
import { getCookie, setCookie, removeCookie } from "../api/cookies";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = getCookie("token");
    const storedUser = getCookie("user");
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        if (userData.isAdmin) {
          setIsAdmin(true);
        }
      } catch (e) {
        console.error("Failed to parse user data from cookie", e);
        setUser(null);
        setIsAdmin(false);
      }
    }
  }, []);

  const login = (userData, token) => {
    setCookie("token", token);
    setCookie("user", JSON.stringify(userData));
    setUser(userData);
    if (userData.isAdmin) {
      setIsAdmin(true);
      setCookie("adminToken", token);
    } else {
      setIsAdmin(false);
      removeCookie("adminToken");
    }
  };

  const logout = () => {
    removeCookie("token");
    removeCookie("user");
    removeCookie("adminToken");
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);