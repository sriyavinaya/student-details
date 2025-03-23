import { useEffect } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";
import TopHeader from "../TopHeader";
import { useAuth } from "@/contexts/AuthContext";

const DashboardLayout = () => {
  const location = useLocation();
  const { isLoggedIn, userRole } = useAuth();
  
  // Scroll to top when navigating to a new page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Redirect to login if not logged in
  // if (!isLoggedIn) {
  //   return <Navigate to="/login" />;
  // }

  // // Redirect to homepage if not a student
  // if (userRole !== 'student') {
  //   return <Navigate to="/" />;
  // }

  return (
    <div className="dashboard-container">
      <StudentSidebar />
      <div className="dashboard-main-content">
        <TopHeader />
        <main className="overflow-y-auto bg-gray-50 animate-fade-in w-full">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;