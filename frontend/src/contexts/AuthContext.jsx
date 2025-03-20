import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      const role = localStorage.getItem("userRole");

      setIsLoggedIn(loggedIn);
      setUserRole(role);
    } catch (error) {
      console.error("Error accessing localStorage", error);
    }
  }, []);

  const login = (role, redirectTo = "/dashboard") => {
    try {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", role || "");
      setIsLoggedIn(true);
      setUserRole(role);
      navigate(redirectTo);
    } catch (error) {
      console.error("Error during login", error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userRole");
      setIsLoggedIn(false);
      setUserRole(null);
      navigate("/");
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
