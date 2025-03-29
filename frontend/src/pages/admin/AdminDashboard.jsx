import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardHeader from "@/components/student/StudentDashboardHeader";

const StatCard = ({ title, count, color, onClick }) => {
  return (
    <div className="relative">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-gray-100 rounded-lg shadow-md transform scale-95"></div>
      
      {/* Foreground Card */}
      <div className="relative bg-white rounded-lg shadow-lg p-6 text-center border border-gray-200">
        {/* Colored Header */}
        <div className={`w-full h-2 rounded-t-lg ${color}`}></div>

        <h3 className="text-gray-700 font-medium text-lg mt-3">{title}</h3>
        <p className="text-5xl font-extrabold text-gray-800 my-2">{count ?? "..."}</p>

        <p className="text-gray-500 text-sm mb-3">Total {title.toLowerCase()}</p>

        <button className="text-blue-600 font-medium hover:underline text-sm" onClick={onClick}>
          VIEW DETAILS
        </button>
      </div>
    </div>
  );
};


const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ students: 0, faculty: 0, flagged: 0 });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetch(`/api/admin/${id}/dashboard-stats`)
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false)); // Handle errors
  }, [id]);

  return (
    <div>
      <DashboardHeader title="Admin Dashboard" />
      
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-200 h-16 rounded-md"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(3).fill(<div className="bg-gray-200 h-40 rounded-md"></div>)}
          </div>
        </div>
      ) : (
        <div className="animate-slide-in">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-medium text-gray-800 mb-2">Welcome, Admin</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <StatCard title="Student Profiles" count={stats.students} color="bg-blue-400" onClick={() => navigate(`/admin/${id}/student-profiles`)} />
  <StatCard title="Faculty Profiles" count={stats.faculty} color="bg-green-400" onClick={() => navigate(`/admin/${id}/faculty-profiles`)} />
  <StatCard title="Flagged Records" count={stats.flagged} color="bg-red-400" onClick={() => navigate(`/admin/${id}/flagged-records`)} />
</div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;




// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import DashboardHeader from "@/components/student/StudentDashboardHeader";

// const StatCard = ({ title, count, bgColor = "bg-gray-200", onClick }) => {
//   return (
//     <div className={`${bgColor} rounded-md p-6 text-center`}>
//       <h3 className="text-gray-700 font-medium text-lg mb-3">{title}</h3>
//       <p className="text-4xl font-bold text-gray-800 mb-3">{count}</p>
//       <button 
//         className="text-blue-500 hover:underline text-sm"
//         onClick={onClick}
//       >
//         VIEW
//       </button>
//     </div>
//   );
// };

// const AdminDashboard = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();
//   const {id} = useParams();

//   useEffect(() => {
//     // Simulate loading
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 800);
    
//     return () => clearTimeout(timer);
//   }, []);

//   const handleViewStudentProfiles = () => {
//     navigate(`/admin/${id}/student-profiles`);
//   };

//   const handleViewFacultyProfiles = () => {
//     navigate(`/admin/${id}/faculty-profiles`);
//   };

//   const handleViewFlaggedRecords = () => {
//     navigate(`/admin/${id}/flagged-records`);
//   };

//   return (
//     <div>
//       <DashboardHeader title="Admin Dashboard" />
      
//       {isLoading ? (
//         <div className="animate-pulse space-y-4">
//           <div className="bg-gray-200 h-16 rounded-md"></div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             <div className="bg-gray-200 h-40 rounded-md"></div>
//             <div className="bg-gray-200 h-40 rounded-md"></div>
//             <div className="bg-gray-200 h-40 rounded-md"></div>
//           </div>
//         </div>
//       ) : (
//         <div className="animate-slide-in" style={{ animationDelay: "150ms" }}>
//           <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//             <h2 className="text-xl font-medium text-gray-800 mb-2">NAME</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               <StatCard title="Student Profiles" count={7500} onClick={handleViewStudentProfiles} />
//               <StatCard title="Faculty Profiles" count={750} onClick={handleViewFacultyProfiles} />
//               <StatCard title="Flagged Records" count={40} onClick={handleViewFlaggedRecords} />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;
