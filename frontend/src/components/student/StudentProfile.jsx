import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const StudentProfile = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/students/${id}`);
        setStudentData(response.data);
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError("Failed to load student profile");
        toast({
          title: "Error",
          description: "Could not fetch student data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, [id, toast]);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-200 h-12 mb-4 rounded-md"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-8 rounded-md"></div>
          ))}
        </div>
        <div className="mt-6 bg-gray-200 h-64 rounded-md"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="text-center py-8">
        <p>No student data found</p>
      </div>
    );
  }

  const formattedDateOfBirth = studentData.dateOfBirth
    ? format(new Date(studentData.dateOfBirth), "dd-MM-yyyy")
    : "Not specified";

  const personalInfo = [
    { label: "Roll No", value: studentData.rollNo || "Not specified" },
    { label: "Email", value: studentData.email || "Not specified" },
    { label: "Date of Birth", value: formattedDateOfBirth },
    { label: "Gender", value: studentData.gender || "Not specified" },
  ];

  const academicInfo = [
    { label: "Degree", value: studentData.degree || "Not specified" },
    { label: "Department", value: studentData.department || "Not specified" },
    { label: "Batch", value: studentData.batch || "Not specified" },
    { label: "Class", value: studentData.studentClass || "Not specified" },
    { label: "CGPA", value: studentData.cgpa || "Not specified" },
    { label: "Address", value: studentData.address || "Not specified" },
  ];

  const facultyInfo = [
    { label: "Faculty Advisor", value: studentData.faculty?.name || "Not assigned" },
    { label: "Faculty Email", value: studentData.faculty?.email || "Not assigned" },
  ];

  return (
    <div className="animate-slide-in space-y-6">
      {/* Header with Student Name */}
      <div>
        <h1 className="ml-4 text-xl font-medium text-gray-800">
          Welcome, {studentData.name}
        </h1>
      </div>

      {/* Personal Information Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {personalInfo.map((item, index) => (
            <div key={index} className="space-y-1">
              <p className="text-sm font-medium text-gray-500">{item.label}</p>
              <p className="text-gray-800">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Information Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {academicInfo.map((item, index) => (
            <div key={index} className="space-y-1">
              <p className="text-sm font-medium text-gray-500">{item.label}</p>
              <p className="text-gray-800">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Faculty Information Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {facultyInfo.map((item, index) => (
            <div key={index} className="space-y-1">
              <p className="text-sm font-medium text-gray-500">{item.label}</p>
              <p className="text-gray-800">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
