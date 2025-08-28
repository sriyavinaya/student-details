import { useState } from "react";
import { Bell, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

const TopHeader = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useUser();
  const location = useLocation();
  
  const { toast } = useToast();
  
  // const [notifications, setNotifications] = useState(0);


  const handleLogout = async () => {
    try {
        await axios.post(
          "http://localhost:8080/api/auth/logout",
          {},
          { withCredentials: true }
        );

      // ✅ Call logout function from context to clear user state
      logoutUser();

      toast({
        title: "Logged out successfully",
        description: "You have been logged out.",
      });

      // ✅ Redirect to login page after logout
      navigate("/");
      
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  // const handleNotification = () => {
  //   setNotifications(0);
  //   toast({
  //     title: "Notifications cleared",
  //     description: "You have no new notifications",
  //   });
  // };

  return (
    <div className="flex justify-between items-center p-4 bg-gray-200 w-full shadow-sm">
      <div className="flex items-center">
        {/* Add user details or other UI elements here if needed */}
      </div>

      <div className="flex items-center space-x-4">
        {/* <button
          onClick={handleNotification}
          className="relative p-2 rounded-full hover:bg-white/60 transition-all"
          aria-label="Notifications"
        >
          <Bell size={20} className="text-gray-600" />
          {notifications > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {notifications}
            </span>
          )}
        </button> */}

        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-1.5 bg-sky-100 hover:bg-sky-200 text-gray-700 rounded-lg transition-all"
        >
          <LogOut size={16} className="mr-1.5" />
          LOGOUT
        </button>
      </div>
    </div>
  );
};

export default TopHeader;


// import { useState } from "react";
// import { Bell, LogOut } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { useAuth } from "@/contexts/AuthContext";

// const TopHeader = () => {
//   const [notifications, setNotifications] = useState(0);
//   const { toast } = useToast();
//   const { logout } = useAuth();

//   const handleLogout = async () => {
//     try {
//       const response = await fetch("http://localhost:8080/api/auth/logout", {
//         method: "POST",
//         credentials: "include", // Ensure cookies/session are included
//       });
  
//       if (!response.ok) {
//         throw new Error("Logout failed");
//       }
  
//       // Remove authentication token from local storage (if using JWT)
//       localStorage.removeItem("authToken");
  
//       // Call logout function from context (if using AuthContext)
//       logout();
  
//       toast({
//         title: "Logged out successfully",
//         description: "You have been logged out.",
//       });
  
//       // Redirect to login page
//       window.location.href = "/login";
  
//     } catch (error) {
//       console.error("Logout error:", error);
//       toast({
//         title: "Logout failed",
//         description: "Please try again.",
//         variant: "destructive",
//       });
//     }
//   };
  

//   const handleNotification = () => {
//     setNotifications(0);
//     toast({
//       title: "Notifications cleared",
//       description: "You have no new notifications",
//     });
//   };

//   return (
//     <div className="flex justify-between items-center p-4 bg-gray-200 w-full shadow-sm">
//       <div className="flex items-center">
//         {/* Add user details or other UI elements here if needed */}
//       </div>

//       <div className="flex items-center space-x-4">
//         <button
//           onClick={handleNotification}
//           className="relative p-2 rounded-full hover:bg-white/60 transition-all"
//           aria-label="Notifications"
//         >
//           <Bell size={20} className="text-gray-600" />
//           {notifications > 0 && (
//             <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
//               {notifications}
//             </span>
//           )}
//         </button>

//         <button
//           onClick={handleLogout}
//           className="flex items-center px-4 py-1.5 bg-sky-100 hover:bg-sky-200 text-gray-700 rounded-lg transition-all"
//         >
//           <LogOut size={16} className="mr-1.5" />
//           LOGOUT
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TopHeader;
