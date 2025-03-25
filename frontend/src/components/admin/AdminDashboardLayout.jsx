import { useEffect } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import TopHeader from "../TopHeader";
import { useUser } from "@/contexts/UserContext";

const AdminDashboardLayout = () => {
  const location = useLocation();
  const { isLoggedIn, userRole } = useUser();
  
  // Scroll to top when navigating to a new page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="dashboard-container">
      <AdminSidebar />
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

export default AdminDashboardLayout;