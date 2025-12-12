import React, { createContext, useContext, useState, useEffect } from "react";
import { getCookie, setCookie, removeCookie } from "../api/cookies";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getCookie("token");
    const adminToken = getCookie("adminToken");

    const verifyUser = async () => {
      try {
        const response = await api.get("/auth/user");
        const userData = response.user;
        setUser(userData);
        if (userData.isAdmin) {
          setIsAdmin(true);
        }
      } catch (error) {
        setUser(null)
        console.error("Failed to verify user, logging out.", error);
      } finally {
        setLoading(false);
      }
    };

    const verifyAdmin = async () => {
      try {
        const response = await api.get("/admin/admin");
        const adminData = response.admin;
        setUser(adminData);
        setIsAdmin(true);
      } catch (error) {
        setUser(null)
         setIsAdmin(false);
        console.error("Failed to verify admin, logging out.", error);
      } finally {
        setLoading(false);
      }
    };

    if (adminToken) {
      verifyAdmin();
    } else if (token) {
      verifyUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, token, type = undefined) => {
    setUser(userData);
    if (!type) {
      setIsAdmin(true);
      setCookie("adminToken", token);
    } else {
      setCookie("token", token);
      setIsAdmin(false);
    }
  };

  const logout = () => {
    removeCookie("token");
    removeCookie("adminToken");
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout, loading, setUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);