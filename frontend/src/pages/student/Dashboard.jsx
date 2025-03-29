import DashboardHeader from "@/components/student/StudentDashboardHeader";
import StudentProfile from "@/components/student/StudentProfile";

const Dashboard = () => {
  return (
    <div>
      <DashboardHeader title="Student Dashboard" />
      <StudentProfile />
    </div>
  );
};

export default Dashboard;
