import nitc from "../assets/nitc.png";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useUser();  // ✅ Use loginUser from AuthContext

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoggingIn(true);
      try {
        const userInfoResponse = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );

        const { email } = userInfoResponse.data;
        // console.log("Sending email:", email);  // Debugging


        const backendResponse = await axios.post(
          "http://localhost:8080/api/auth/google-login",
          { email: email },
          { withCredentials: true }
        );

        if (backendResponse.status === 200) {
          const { token, role, id } = backendResponse.data;

          // ✅ Call AuthContext login function to update global state
          loginUser({ id, role, token });

          // ✅ Navigate to the correct dashboard
          navigate(getDashboardRoute(role, id));
        } else {
          toast.error(backendResponse.data.message || "Login failed.");
        }
      } catch (error) {
        console.error("Google login failed:", error);
        toast.error("An error occurred during Google login. Please try again.");
      } finally {
        setIsLoggingIn(false);
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
      toast.error("Login failed. Please try again.");
    },
  });

  const getDashboardRoute = (role, id) => {
    switch (role) {
      case "student":
        return `/dashboard/${id}`;
      case "faculty":
        return `/faculty/${id}`;
      case "admin":
        return `/admin/${id}`;
      default:
        toast.error("Invalid role. Please contact support.");
        return "/login";
    }
  };

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




// import nitc from "../assets/nitc.png";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import { useUser } from "@/contexts/AuthContext";
// import { Button } from "@/components/ui/button";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useGoogleLogin } from "@react-oauth/google";

// const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [isLoggingIn, setIsLoggingIn] = useState(false);
//   const navigate = useNavigate();
//   const { login } = useUser();

//   const googleLogin = useGoogleLogin({
//     onSuccess: async (tokenResponse) => {
//       try {
//         const userInfoResponse = await axios.get(
//           "https://www.googleapis.com/oauth2/v3/userinfo",
//           {
//             headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
//           }
//         );

//         // console.log(userInfoResponse.data);
          
        

//         const {email} = userInfoResponse.data;
//         // const backendResponse = await axios.post(
//         //   "http://localhost:8080/api/auth/google-login",
//         //   { email},
//         //   { withCredentials: true }
//         // );
//         //  console.log(backendResponse);
//         //   console.log("Hi");
//         // if (backendResponse) {
//         //   localStorage.setItem("token", backendResponse.data.token);
//         //   console.log("\n\nEntered frontend"+backendResponse);
//         //   const role = backendResponse.data.role;
//         //   if (role === "student") {
//         //     navigate("/dashboard");
//         //   } else if (role === "ROLE_FACULTY") {
//         //     navigate("/faculty");
//         //   } else if (role === "ROLE_ADMIN") {
//         //     navigate("/admin");
//         //   }
//         // } else {
//         //   toast.error(backendResponse.data.message);
//         // }
//         try {
//           const backendResponse = await axios.post(
//             "http://localhost:8080/api/auth/google-login",
//             { email },
//             { withCredentials: true }
//           );
        
//           // console.log(backendResponse);
//           // console.log("Hi");
        
//           localStorage.setItem("token", backendResponse.data.token);
//           // console.log("\n\nEntered frontend", backendResponse);
//           const role = backendResponse.data.role;
//           const id = backendResponse.data.id;
//           if (role === "student") {
//             navigate("/dashboard/${id}");
//           } else if (role === "faculty") {
//             navigate("/faculty/${id}");
//           } else if (role === "admin") {
//             navigate("/admin/${id}");
//           } 
//         } catch (error) {
//           console.error("Error during Google login:", error);
//           toast.error(
//             error.response?.data?.message || "An error occurred during login."
//           );
//         }
        
//       } catch (error) {
//         console.error("Google login failed:", error);
//         toast.error("An error occurred during Google login. Please try again.");
//       }
//     },
//     onError: (error) => {
//       console.error("Login Failed:", error);
//       toast.error("Login failed. Please try again.");
//     },
//   });

//   return (
//     <div className="flex flex-col min-h-screen bg-[#D5E2ED]">
//       <header className="bg-[#d9d9d9] py-4 px-6 shadow-sm">
//         <h1 className="text-2xl font-bold text-gray-800">Student Details</h1>
//       </header>

//       <main className="flex-1 flex items-center justify-center p-8">
//         <div className="flex w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in">
//           <div className="hidden md:block w-1/2">
//             <img src={nitc} alt="NIT Calicut Campus" className="w-full h-full object-cover" />
//           </div>

//           <div className="w-full md:w-1/2 p-8 md:p-12">
//             <div className="max-w-md mx-auto space-y-8 text-center">
//               <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
//               <p className="text-gray-600">Sign in with your NITC email</p>

//               <Button
//                 className="w-full py-6 bg-[#D5E2ED] hover:bg-[#c4d3e0] text-gray-800 font-medium rounded-lg flex items-center justify-center space-x-2"
//                 onClick={googleLogin}
//                 disabled={isLoggingIn}
//               >
//                 <img
//                   src="https://www.google.com/favicon.ico"
//                   alt="Google"
//                   className="w-5 h-5"
//                 />
//                 <span>{isLoggingIn ? "Signing in..." : "Sign in with Google"}</span>
//               </Button>

//               <p className="text-sm text-gray-600 mt-8">
//                 By continuing, you agree to our Terms of Service and Privacy Policy.
//               </p>
//             </div>
//           </div>
//         </div>
//       </main>

//       <footer className="bg-[#d9d9d9] py-4 px-6 text-center text-gray-600 shadow-inner">
//         <p>© {new Date().getFullYear()} Student Details. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default LoginPage;
