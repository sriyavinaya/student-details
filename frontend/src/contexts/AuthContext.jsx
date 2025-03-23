import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // ✅ Initialize state directly from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || null);

  // ✅ Function to handle login
  const login = (role) => {
    try {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", role);
      setIsLoggedIn(true);
      setUserRole(role);

      // ✅ Redirect user based on role
      if (role === "ROLE_STUDENT") navigate("/dashboard");
      else if (role === "ROLE_FACULTY") navigate("/faculty");
      else if (role === "admin") navigate("/admin");
      else navigate("/");
    } catch (error) {
      console.error("Error during login", error);
    }
  };

  // ✅ Function to handle logout
  const logout = () => {
    try {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userRole");
      setIsLoggedIn(false);
      setUserRole(null);
      navigate("/login");
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

// ✅ Custom Hook to use Auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
