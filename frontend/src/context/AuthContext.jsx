import { createContext, useState, useEffect } from "react";
import api from "../services/api";


export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const fetchMe = async (token) => {
    try {
      const res = await api.get("auth/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.log("Auth error:", err);
      // If token is invalid, remove it
      if (err.response?.status === 401) {
        localStorage.removeItem("accessToken");
        setUser(null);
      }
    }
  };

  const login = async (email, password) => {
    const res = await api.post("auth/token/", { 
      email: email, // Now using email directly
      password: password 
    });
    const accessToken = res.data.access;

    localStorage.setItem("accessToken", accessToken);
    await fetchMe(accessToken);
  };

  const register = async (form) => {
    return await api.post("auth/register/", form);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) fetchMe(token);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
