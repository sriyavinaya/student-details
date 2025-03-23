// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import axios from "axios";

// const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [role, setRole] = useState("ROLE_STUDENT"); // Default role
//   const [isLoggingIn, setIsLoggingIn] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
  
//     try {
//       setIsLoggingIn(true);
//       const response = await axios.post("http://localhost:8080/api/auth/manual-login", {
//         email: email,
//         role: role,
//       });
  
//       if (response.data.success) {
//         localStorage.setItem("token", response.data.token);  // Store token
//         localStorage.setItem("role", role);  // Store role
  
//         if (role === "ROLE_STUDENT") {
//           navigate("/dashboard");
//         } else if (role === "ROLE_FACULTY") {
//           navigate("/faculty");
//         } else if (role === "ROLE_ADMIN") {
//           navigate("/admin");
//         }
//       } else {
//         alert("Invalid email or role. Please try again.");
//       }
//     } catch (error) {
//       alert("Login failed! Please check your credentials.");
//     } finally {
//       setIsLoggingIn(false);
//     }
//   };
  

//   return (
//     <div className="flex flex-col min-h-screen bg-[#D5E2ED]">
//       <header className="bg-[#d9d9d9] py-4 px-6 shadow-sm">
//         <h1 className="text-2xl font-bold text-gray-800">Student Details</h1>
//       </header>

//       <main className="flex-1 flex items-center justify-center p-8">
//         <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
//           <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Login</h2>

//           <form onSubmit={handleLogin} className="space-y-4">
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full border border-gray-300 rounded-md p-2 mt-1"
//                 required
//               />
//             </div>

//             <div>
//               <label htmlFor="role" className="block text-sm font-medium text-gray-700">
//                 Select Role
//               </label>
//               <select
//                 id="role"
//                 value={role}
//                 onChange={(e) => setRole(e.target.value)}
//                 className="w-full border border-gray-300 rounded-md p-2 mt-1"
//                 required
//               >
//                 <option value="ROLE_STUDENT">Student</option>
//                 <option value="ROLE_FACULTY">Faculty</option>
//                 <option value="ROLE_ADMIN">Admin</option>
//               </select>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
//               disabled={isLoggingIn}
//             >
//               {isLoggingIn ? "Logging in..." : "Login"}
//             </button>
//           </form>
//         </div>
//       </main>

//       <footer className="bg-[#d9d9d9] py-4 px-6 text-center text-gray-600 shadow-inner">
//         <p>© {new Date().getFullYear()} Student Details. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default LoginPage;




import nitc from "../assets/nitc.png";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfoResponse = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );

        console.log(userInfoResponse.data);
          
        

        const { email} = userInfoResponse.data;
        // const backendResponse = await axios.post(
        //   "http://localhost:8080/api/auth/google-login",
        //   { email},
        //   { withCredentials: true }
        // );
        //  console.log(backendResponse);
        //   console.log("Hi");
        // if (backendResponse) {
        //   localStorage.setItem("token", backendResponse.data.token);
        //   console.log("\n\nEntered frontend"+backendResponse);
        //   const role = backendResponse.data.role;
        //   if (role === "student") {
        //     navigate("/dashboard");
        //   } else if (role === "ROLE_FACULTY") {
        //     navigate("/faculty");
        //   } else if (role === "ROLE_ADMIN") {
        //     navigate("/admin");
        //   }
        // } else {
        //   toast.error(backendResponse.data.message);
        // }
        try {
          const backendResponse = await axios.post(
            "http://localhost:8080/api/auth/google-login",
            { email },
            { withCredentials: true }
          );
        
          console.log(backendResponse);
          console.log("Hi");
        
          localStorage.setItem("token", backendResponse.data.token);
          console.log("\n\nEntered frontend", backendResponse);
         console.log(backendResponse.data);
          const role = backendResponse.data.role;
          console.log(backendResponse.data.role);
          console.log(role);
          if (role === "student") {
            navigate("/dashboard");
          } else if (role === "faculty") {
            navigate("/faculty");
          } else if (role === "admin") {
            navigate("/admin");
          } 
        } catch (error) {
          console.error("Error during Google login:", error);
          toast.error(
            error.response?.data?.message || "An error occurred during login."
          );
        }
        
      } catch (error) {
        console.error("Google login failed:", error);
        toast.error("An error occurred during Google login. Please try again.");
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
      toast.error("Login failed. Please try again.");
    },
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#D5E2ED]">
      <header className="bg-[#d9d9d9] py-4 px-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Student Details</h1>
      </header>

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="flex w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in">
          <div className="hidden md:block w-1/2">
            <img src={nitc} alt="NIT Calicut Campus" className="w-full h-full object-cover" />
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-12">
            <div className="max-w-md mx-auto space-y-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
              <p className="text-gray-600">Sign in with your NITC email</p>

              <Button
                className="w-full py-6 bg-[#D5E2ED] hover:bg-[#c4d3e0] text-gray-800 font-medium rounded-lg flex items-center justify-center space-x-2"
                onClick={googleLogin}
                disabled={isLoggingIn}
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-5 h-5"
                />
                <span>{isLoggingIn ? "Signing in..." : "Sign in with Google"}</span>
              </Button>

              <p className="text-sm text-gray-600 mt-8">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#d9d9d9] py-4 px-6 text-center text-gray-600 shadow-inner">
        <p>© {new Date().getFullYear()} Student Details. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoginPage;



// import { useState } from 'react';
// import nitc from '../assets/nitc.png';
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import { useAuth } from "@/contexts/AuthContext";
// import { Button } from "@/components/ui/button";

// const LoginPage = () => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [selectedRole, setSelectedRole] = useState('');
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const handleRoleSelect = (role) => {
//     setSelectedRole(role);
//     setShowDropdown(false);
//   };

//   const handleLogin = () => {
//     if (selectedRole === 'Student') {
//       // Use the login function from AuthContext
//       login('student');
//       toast.success("Login successful!");
//       navigate('/dashboard');
//     } else if (selectedRole === 'Admin') {
//       login('admin');
//       toast.success("Admin login successful!");
//       navigate('/admin');
//     } else if (selectedRole === 'Faculty') {
//       login('faculty');
//       toast.success("Faculty login successful!");
//       navigate('/faculty');
//     } else {
//       toast.error(`Please select a role before logging in`);
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-[#D5E2ED]">
//       {/* Header */}
//       <header className="bg-[#d9d9d9] py-4 px-6 shadow-sm">
//         <div className="flex items-center space-x-2">
//           {/* <GraduationCap size={36} className="text-blue-700" /> */}
//           <h1 className="text-2xl font-bold text-gray-800">Student Details</h1>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="flex-1 flex items-center justify-center p-8">
//         <div className="flex w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in">
//           {/* Image Side */}
//           <div className="hidden md:block w-1/2 relative">
//             <img 
//               src={nitc}
//               alt="NIT Calicut Campus" 
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute inset-0 bg-blue-900/20 flex flex-col justify-end p-8">
//             </div>
//           </div>
          
//           {/* Login Side */}
//           <div className="w-full md:w-1/2 p-8 md:p-12">
//             <div className="max-w-md mx-auto space-y-8">
//               <div className="text-center mb-8">
//                 <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
//                 <p className="text-gray-600">Please sign in to continue</p>
//               </div>
              
//               {/* Role Selection Dropdown */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Select Role</label>
//                 <div className="relative">
//                   <button
//                     type="button"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg flex justify-between items-center bg-white hover:border-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
//                     onClick={() => setShowDropdown(!showDropdown)}
//                   >
//                     <span className={selectedRole ? "text-gray-800" : "text-gray-500"}>
//                       {selectedRole || 'Select role...'}
//                     </span>
//                     <span className="text-blue-500">▼</span>
//                   </button>
                  
//                   {showDropdown && (
//                     <div className="absolute w-full mt-1 border border-gray-300 bg-white rounded-lg shadow-lg z-10 animate-slide-in">
//                       {['Student', 'Faculty', 'Admin'].map((role) => (
//                         <div
//                           key={role}
//                           className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
//                           onClick={() => handleRoleSelect(role)}
//                         >
//                           {role}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
              
//               {/* Sign In Button */}
//               <Button
//                 className="w-full py-6 bg-[#D5E2ED] hover:bg-[#c4d3e0] text-gray-800 font-medium rounded-lg transition-colors"
//                 onClick={handleLogin}
//                 disabled={!selectedRole}
//               >
//                 <img 
//                   src="https://www.google.com/favicon.ico" 
//                   alt="Google" 
//                   className="w-5 h-5 mr-2" 
//                 />
//                 Sign in with Google
//               </Button>
              
//               <p className="text-center text-sm text-gray-600 mt-8">
//                 By continuing, you agree to our Terms of Service and Privacy Policy.
//               </p>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-[#d9d9d9] py-4 px-6 text-center text-gray-600 shadow-inner">
//         <p>© {new Date().getFullYear()} Student Details. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default LoginPage;