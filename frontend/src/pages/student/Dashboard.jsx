import PageTemplate from "@/components/student/StudentPageTemplate";
import StudentProfile from "@/components/student/StudentProfile";

const Dashboard = () => {
  return (
    <div>
      <PageTemplate title="Student Dashboard">
      <StudentProfile />
      </PageTemplate>
    </div>
  );
};

export default Dashboard;
