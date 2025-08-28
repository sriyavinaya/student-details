import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageTemplate from "@/components/student/StudentPageTemplate";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const StatCard = ({ title, count, bgColor = "bg-blue-50", textColor = "text-blue-800", onClick }) => {
  return (
    <div 
      className={`${bgColor} rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
      onClick={onClick}
    >
      <h3 className={`${textColor} font-medium text-lg mb-3`}>{title}</h3>
      <p className={`text-4xl font-bold ${textColor} mb-3`}>{count ?? "..."}</p>
      <button 
        className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
      >
        VIEW ALL
      </button>
    </div>
  );
};

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    flagged: 0
  });
  const [adminName, setAdminName] = useState("Admin");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get admin ID from localStorage
  const userToken = JSON.parse(localStorage.getItem("user"));
  const adminId = userToken?.id;

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!adminId) return;
      
      try {
        setIsLoading(true);
        
        // Fetch all stats
        const [studentsRes, facultyRes, flaggedRes] = await Promise.all([
          axios.get('http://localhost:8080/api/admin/all-students'),
          axios.get('http://localhost:8080/api/admin/all-faculty'),
          axios.get('http://localhost:8080/api/flagged')
        ]);

        setStats({
          students: studentsRes.data.length,
          faculty: facultyRes.data.length,
          flagged: flaggedRes.data.length
        });
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [adminId, toast]);

  const handleViewStudentProfiles = () => {
    navigate(`/admin/${adminId}/student-profiles`);
  };

  const handleViewFacultyProfiles = () => {
    navigate(`/admin/${adminId}/faculty-profiles`);
  };

  const handleViewFlaggedRecords = () => {
    navigate(`/admin/${adminId}/flagged-records`);
  };

  if (!adminId) {
    return (
      <PageTemplate title="Admin Dashboard">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-red-500">Admin ID not found. Please log in again.</p>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate title="Admin Dashboard">
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-200 h-16 rounded-md"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-200 h-40 rounded-lg"></div>
            <div className="bg-gray-200 h-40 rounded-lg"></div>
            <div className="bg-gray-200 h-40 rounded-lg"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Welcome, {adminName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard 
                title="Student Profiles" 
                count={stats.students} 
                bgColor="bg-blue-50"
                textColor="text-blue-800"
                onClick={handleViewStudentProfiles}
              />
              <StatCard 
                title="Faculty Profiles" 
                count={stats.faculty} 
                bgColor="bg-green-50"
                textColor="text-green-800"
                onClick={handleViewFacultyProfiles}
              />
              <StatCard 
                title="Flagged Records" 
                count={stats.flagged} 
                bgColor="bg-red-50"
                textColor="text-red-800"
                onClick={handleViewFlaggedRecords}
              />
            </div>
          </div>
        </div>
      )}
    </PageTemplate>
  );
};

export default AdminDashboard;