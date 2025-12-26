"use client";

import { createContext, useEffect, useState } from "react";

interface Admin {
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  role: string;
}

interface AuthContextType {
  token: string | null;
  admin: Admin | null;
  user: Admin | null;
  isAuthenticated: boolean;
  loading: boolean;
  setAuthData: (token: string, admin: Admin) => void;
  clearAuthData: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  admin: null,
  user: null,
  isAuthenticated: false,
  loading: true,
  setAuthData: () => {},
  clearAuthData: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = Boolean(token);

  const setAuthData = (token: string, admin: Admin) => {
    setToken(token);
    setAdmin(admin);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("sudo_admin_data", JSON.stringify(admin));
  };

  const clearAuthData = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("sudo_admin_data");
  };

  const logout = () => {
    clearAuthData();
    window.location.href = "/sudo/auth";
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedAdmin = localStorage.getItem("sudo_admin_data");
    if (storedToken && storedAdmin) {
      setToken(storedToken);
      setAdmin(JSON.parse(storedAdmin));
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        admin,
        user: admin,
        isAuthenticated,
        loading,
        setAuthData,
        clearAuthData,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
