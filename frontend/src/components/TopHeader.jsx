import { useState } from "react";
import { Bell, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const TopHeader = () => {
  const [notifications, setNotifications] = useState(0);
  const { toast } = useToast();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      // Send a request to the backend API for logout
      const response = await fetch("http://localhost:8080/api/logout", {
        method: "POST", // Use POST or GET based on your backend implementation
        credentials: "include", // Include cookies if session-based authentication is used
      });

      if (response.ok) {
        // Call the frontend logout logic
        logout();
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account",
        });
      } else {
        throw new Error("Failed to log out from the server");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNotification = () => {
    setNotifications(0);
    toast({
      title: "Notifications cleared",
      description: "You have no new notifications",
    });
  };

  return (
    <div className="flex justify-between items-center p-4 bg-gray-200 w-full shadow-sm">
      <div className="flex items-center">
        {/* Add user details or other UI elements here if needed */}
      </div>

      <div className="flex items-center space-x-4">
        <button
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
        </button>

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
