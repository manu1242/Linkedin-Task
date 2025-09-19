import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ no *
import api from "../Api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ id: decoded.id }); // temporary from token

        api
          .get("/auth/getme", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            if (res.data?.User) {
              setUser(res.data.User);
            }
          })
          .catch((err) => {
            if (err.response?.status === 401) {
              localStorage.removeItem("token");
              setUser(null);
            } else {
              console.error(
                "Failed to fetch user:",
                err.response?.data || err.message
              );
            }
          })

          .finally(() => setLoading(false));
      } catch (err) {
        console.error("Invalid token:", err.message);
        localStorage.removeItem("token");
        setUser(null);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Register
  const register = async (Name, Email, Password, UserType = "REGULAR_USER") => {
    const res = await api.post("/auth/register", {
      Name,
      Email,
      Password,
      UserType,
    });

    const { token, User } = res.data;
    if (token) {
      localStorage.setItem("token", token);
      setUser(User);
    }
    return User;
  };

  // Login
  const login = async (Email, Password) => {
    const res = await api.post("/auth/login", { Email, Password });

    const { token, User } = res.data;
    if (token) {
      localStorage.setItem("token", token);
      setUser(User);
    }
    return User;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
