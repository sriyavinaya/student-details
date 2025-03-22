// import { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";

// // ✅ Create Auth Context
// const AuthContext = createContext(null);

// // ✅ Auth Provider Component
// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // ✅ Verify Token Validity Before Setting User
//   const verifyToken = async (token) => {
//     try {
//       const response = await axios.get("http://localhost:8080/api/auth/verify-token", {
//         headers: { Authorization: `Bearer ${token}` },
//         withCredentials: true
//       });

//       return response.status === 200; // ✅ Returns true if token is valid
//     } catch (error) {
//       return false; // ❌ Token is invalid
//     }
//   };

//   // ✅ Load User on Page Load
//   useEffect(() => {
//     const email = localStorage.getItem("email");
//     const role = localStorage.getItem("role");
//     const token = localStorage.getItem("token");

//     if (email && role && token) {
//       verifyToken(token).then((isValid) => {
//         if (isValid) {
//           setUser({ email, role, token });
//         } else {
//           logout(); // ❌ Invalid token, log out user
//         }
//       });
//     }
//   }, []);

//   // ✅ Login Function
//   const login = (email, role, token) => {
//     localStorage.setItem("email", email);
//     localStorage.setItem("role", role);
//     localStorage.setItem("token", token);
//     setUser({ email, role, token });
//   };

//   // ✅ Logout Function
//   const logout = () => {
//     localStorage.removeItem("email");
//     localStorage.removeItem("role");
//     localStorage.removeItem("token");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // ✅ Custom Hook: useAuth
// const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// // ✅ Fix Export: Use Named Exports (Recommended for Vite)
// export { AuthProvider, useAuth };


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