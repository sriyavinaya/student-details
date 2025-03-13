
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/student/StudentDashboardHeader";

interface StatCardProps {
  title: string;
  count: number;
  bgColor?: string;
  onClick?: () => void;
}

const StatCard = ({ title, count, bgColor = "bg-gray-200", onClick }: StatCardProps) => {
  return (
    <div className={`${bgColor} rounded-md p-6 text-center`}>
      <h3 className="text-gray-700 font-medium text-lg mb-3">{title}</h3>
      <p className="text-4xl font-bold text-gray-800 mb-3">{count}</p>
      <button 
        className="text-blue-500 hover:underline text-sm"
        onClick={onClick}
      >
        VIEW
      </button>
    </div>
  );
};

const FacultyDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const handleViewStudentProfiles = () => {
    navigate('/faculty/student-profiles');
  };

  const handleViewApprovedProfiles = () => {
    navigate('/faculty/student-profiles', { state: { statusFilter: 'Approved' } });
  };

  const handleViewRejectedProfiles = () => {
    navigate('/faculty/profile-verification', { state: { statusFilter: 'Rejected' } });
  };

  const handleViewPendingProfiles = () => {
    navigate('/faculty/profile-verification', { state: { statusFilter: 'Pending' } });
  };

  return (
    <div>
      <DashboardHeader title="Faculty Dashboard" />
      
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-200 h-16 rounded-md"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-200 h-40 rounded-md"></div>
            <div className="bg-gray-200 h-40 rounded-md"></div>
            <div className="bg-gray-200 h-40 rounded-md"></div>
            <div className="bg-gray-200 h-40 rounded-md"></div>
          </div>
        </div>
      ) : (
        <div className="animate-slide-in" style={{ animationDelay: "150ms" }}>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-medium text-gray-800 mb-2">NAME</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Student Profiles" count={75} onClick={handleViewStudentProfiles} />
              <StatCard title="Approved Profiles" count={40} onClick={handleViewApprovedProfiles} />
              <StatCard title="Rejected Profiles" count={15} onClick={handleViewRejectedProfiles} />
              <StatCard title="Pending Profiles" count={15} onClick={handleViewPendingProfiles} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
