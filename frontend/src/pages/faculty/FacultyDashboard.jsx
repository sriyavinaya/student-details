import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageTemplate from "@/components/student/StudentPageTemplate";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const StatCard = ({ title, count, bgColor = "bg-gray-100", textColor = "text-gray-800", onClick }) => {
  return (
    <div 
      className={`${bgColor} rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
      onClick={onClick}
    >
      <h3 className={`${textColor} font-medium text-lg mb-3`}>{title}</h3>
      <p className={`text-4xl font-bold ${textColor} mb-3`}>{count}</p>
      <button 
        className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
      >
        VIEW ALL
      </button>
    </div>
  );
};

const FacultyDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [counts, setCounts] = useState({
    totalStudents: 0,
    pendingRecords: 0
  });
  const [facultyName, setFacultyName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get faculty ID from localStorage
  const userToken = JSON.parse(localStorage.getItem("user"));
  const facultyId = userToken?.id;

  useEffect(() => {
    const fetchCounts = async () => {
      if (!facultyId) return;
      
      try {
        setIsLoading(true);
        
        // Fetch total students count
        const studentsResponse = await axios.get(
          `http://localhost:8080/api/faculty/${facultyId}/students`
        );
        
        // Fetch pending records count
        const pendingResponse = await axios.get(
          `http://localhost:8080/api/faculty/${facultyId}/pending-records`
        );

        // Fetch faculty details to get the name
        const facultyResponse = await axios.get(
          `http://localhost:8080/api/faculty/${facultyId}`
        );

        setCounts({
          totalStudents: studentsResponse.data.length,
          pendingRecords: pendingResponse.data.length
        });
        
        setFacultyName(facultyResponse.data.name);
      } catch (error) {
        console.error("Error fetching counts:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, [facultyId, toast]);

  const handleViewStudentProfiles = () => {
    navigate(`/faculty/${facultyId}/student-profiles`);
  };

  const handleViewPendingRecords = () => {
    navigate(`/faculty/${facultyId}/profile-verification`);
  };

  if (!facultyId) {
    return (
      <PageTemplate title="Faculty Dashboard">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-red-500">Faculty ID not found. Please log in again.</p>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate title="Faculty Dashboard">
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-200 h-16 rounded-md"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-200 h-40 rounded-lg"></div>
            <div className="bg-gray-200 h-40 rounded-lg"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Welcome, {facultyName || "Faculty"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard 
                title="Student Profiles" 
                count={counts.totalStudents} 
                bgColor="bg-blue-50"
                textColor="text-blue-800"
                onClick={handleViewStudentProfiles}
              />
              <StatCard 
                title="Pending Records" 
                count={counts.pendingRecords} 
                bgColor="bg-blue-50"
                textColor="text-blue-800"
                onClick={handleViewPendingRecords}
              />
            </div>
          </div>
        </div>
      )}
    </PageTemplate>
  );
};

export default FacultyDashboard;