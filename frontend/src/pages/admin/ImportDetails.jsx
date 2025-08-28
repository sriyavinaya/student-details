import DashboardHeader from "@/components/student/StudentDashboardHeader";

const ImportDetails = () => {
  return (
    <div>
      <DashboardHeader title="Import Details" />
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-600">This page will allow administrators to import data from external sources.</p>
      </div>
    </div>
  );
};

export default ImportDetails;