
import { useState, useEffect } from "react";
import DashboardHeader from "@/components/student/StudentDashboardHeader";
import StudentProfile from "@/components/student/StudentProfile";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <DashboardHeader title="Student Dashboard" />
      <div className="animate-slide-in" style={{ animationDelay: "150ms" }}>
        <StudentProfile />
      </div>
    </div>
  );
};

export default Dashboard;
