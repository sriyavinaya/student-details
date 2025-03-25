// import { useEffect } from "react";
// import { Outlet, useLocation, useNavigate } from "react-router-dom";
// import StudentSidebar from "./StudentSidebar";
// import TopHeader from "../TopHeader";
// import { useUser } from "@/contexts/AuthContext";

// const DashboardLayout = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { isLoggedIn, userRole } = useUser();

//   console.log(isLoggedIn);

//   // Redirect if user is not authenticated
//   useEffect(() => {
//     if (!isLoggedIn) {
//       navigate("/login");
//     }
//   }, [isLoggedIn, navigate]);

//   // Scroll to top when navigating to a new page
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [location.pathname]);

//   return (
//     <div className="dashboard-container flex">
//       <StudentSidebar />
//       <div className="dashboard-main-content flex-1">
//         <TopHeader />
//         <main className="overflow-y-auto bg-gray-50 animate-fade-in w-full">
//           <div className="p-6">
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;


import { useEffect } from "react";
import { Outlet, useLocation, Navigate , useParams} from "react-router-dom";
import StudentSidebar from "./StudentSidebar";
import TopHeader from "../TopHeader";
import { useUser } from "@/contexts/UserContext";

const DashboardLayout = () => {
  const location = useLocation();
  const { isLoggedIn, userRole } = useUser();
  const { id } = useParams();
  
  // Scroll to top when navigating to a new page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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