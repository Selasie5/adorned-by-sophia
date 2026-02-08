"use client";

import { createContext, useState } from "react";

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
  const [admin, setAdmin] = useState<Admin | null>(() => {
    if (typeof window === 'undefined') return null;
    const storedAdmin = localStorage.getItem("sudo_admin_data");
    return storedAdmin ? JSON.parse(storedAdmin) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem("accessToken");
  });
  const [_loading] = useState(() => {
    if (typeof window === 'undefined') return true;
    return false;
  });
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

  return (
    <AuthContext.Provider
      value={{
        token,
        admin,
        user: admin,
        isAuthenticated,
        loading: _loading,
        setAuthData,
        clearAuthData,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
