import React, { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/* Variables del user que manejaremos en el ERPz */
type User = {
  nombre: string;
  rol: string;
  email?: string;
};

interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

/* Componente Personalizado para manejar usuario y localstorage */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(
    (userData: User, token: string) => {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      setUser(userData);
      navigate("/");
    },
    [navigate]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/auth");
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};

/* Función para verificar permisos*/
export const canAccess = (user: User | null, allowedRoles: string[]) => {
  if (!user) return false;
  return allowedRoles.includes(user.rol);
};