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
        console.log(response.data);
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

  // Format date of birth if it exists
  const formattedDateOfBirth = studentData.dateOfBirth 
    ? format(new Date(studentData.dateOfBirth), 'dd-MM-yyyy') 
    : 'Not specified';

  // Personal Information Section
  const personalInfo = [
    { label: "Roll No", value: studentData.rollNo || "Not specified" },
    { label: "Email", value: studentData.email || "Not specified" },
    { label: "Date of Birth", value: formattedDateOfBirth },
    { label: "Gender", value: studentData.gender || "Not specified" },
  ];

  // Academic Information Section
  const academicInfo = [
    { label: "Degree", value: studentData.degree || "Not specified" },
    { label: "Department", value: studentData.department || "Not specified" },
    { label: "Batch", value: studentData.batch || "Not specified" },
    { label: "Class", value: studentData.studentClass || "Not specified" },
    { label: "CGPA", value: studentData.cgpa || "Not specified" },
    { label: "Faculty Advisor", value: studentData.faculty?.name || "Not assigned" },
    { label: "Faculty Email", value: studentData.faculty?.email || "Not assigned" },
    { label: "Address", value: studentData.address || "Not specified" }
  ];



  return (
    <div className="animate-slide-in space-y-6">
      {/* Header with Student Name */}
      <div>
        <h1 className="ml-4 text-xl font-medium text-gray-800">  Welcome, {studentData.name}</h1>
      </div>

      {/* Personal Information Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Personal Information</h2> */}
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
        {/* <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Academic Information</h2> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {academicInfo.map((item, index) => (
            <div key={index} className="space-y-1">
              <p className="text-sm font-medium text-gray-500">{item.label}</p>
              <p className="text-gray-800">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Status Badge */}
    </div>
  );
};

export default StudentProfile;







// import { useState, useEffect } from "react";

// const StudentProfile = ({
//   name = "John Doe",
//   registerNo = "12345678",
//   email = "john.doe@university.edu",
//   degree = "Bachelor of Technology",
//   specialization = "Computer Science",
//   yearOfAdmission = "2022",
//   dateOfBirth = "15-05-2001",
//   hostel = "North Campus",
//   roomNo = "N-307"
// }) => {
//   const [isLoading, setIsLoading] = useState(true);

//   // Simulate data loading
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 600);
    
//     return () => clearTimeout(timer);
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="animate-pulse">
//         <div className="bg-gray-200 h-12 mb-4 rounded-md"></div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="bg-gray-200 h-8 rounded-md"></div>
//           <div className="bg-gray-200 h-8 rounded-md"></div>
//           <div className="bg-gray-200 h-8 rounded-md"></div>
//         </div>
//         <div className="mt-6 bg-gray-200 h-64 rounded-md"></div>
//       </div>
//     );
//   }

//   const profileData = [
//     { label: "Degree", value: degree },
//     { label: "Specialization", value: specialization },
//     { label: "Year of Admission", value: yearOfAdmission },
//     { label: "Date of Birth", value: dateOfBirth },
//     { label: "Hostel", value: hostel },
//     { label: "Room No", value: roomNo },
//   ];

//   return (
//     <div className="animate-slide-in">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 bg-gray-200 rounded-lg p-4">
//         <div className="text-gray-800">
//           <h2 className="text-sm font-medium uppercase text-gray-500">NAME</h2>
//           <p className="mt-1 font-medium">{name}</p>
//         </div>
//         <div className="text-gray-800">
//           <h2 className="text-sm font-medium uppercase text-gray-500">REGISTER NO.</h2>
//           <p className="mt-1 font-medium">{registerNo}</p>
//         </div>
//         <div className="text-gray-800">
//           <h2 className="text-sm font-medium uppercase text-gray-500">EMAIL</h2>
//           <p className="mt-1 font-medium">{email}</p>
//         </div>
//       </div>
      
//       <div className="bg-dashboard-card rounded-lg p-6 shadow-sm">
//         <ul className="space-y-4">
//           {profileData.map((item, index) => (
//             <li 
//               key={index} 
//               className="flex items-start"
//               style={{ animationDelay: `${index * 50}ms` }}
//             >
//               <span className="w-36 text-sm font-medium text-gray-600">{item.label}</span>
//               <span className="flex-1 text-gray-800">{item.value}</span>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default StudentProfile;