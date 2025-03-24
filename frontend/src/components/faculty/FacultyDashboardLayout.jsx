import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import FacultySidebar from "./FacultySidebar";
import TopHeader from "../TopHeader";
import { useUser } from "@/contexts/UserContext";


const FacultyDashboardLayout = () => {
  const [activePage, setActivePage] = useState("faculty"); // ✅ Fixed missing useState import
  const location = useLocation(); // ✅ Correctly initializing location
  const user = useUser(); // ✅ Ensure that this is returning user data properly

  // Scroll to top when navigating to a new page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="dashboard-container">
      <FacultySidebar />
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

export default FacultyDashboardLayout;


// import { useEffect } from "react";
// import { Outlet, useLocation, Navigate } from "react-router-dom";
// import FacultySidebar from "./FacultySidebar";
// import TopHeader from "../TopHeader";
// import { useUser } from "@/contexts/AuthContext";

// const FacultyDashboardLayout = () => {
//   const [activePage, setActivePage] = useState("alumni");
//   const user = useUser();
  
//   // Scroll to top when navigating to a new page
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [location.pathname]);

//   return (
//     <div className="dashboard-container">
//       <FacultySidebar />
//       <div className="dashboard-main-content">
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

// export default FacultyDashboardLayout;