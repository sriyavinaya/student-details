
import { useState, useEffect } from "react";

interface StudentProfileProps {
  name?: string;
  registerNo?: string;
  email?: string;
  degree?: string;
  specialization?: string;
  yearOfAdmission?: string;
  dateOfBirth?: string;
  hostel?: string;
  roomNo?: string;
}

const StudentProfile = ({
  name = "Sriya",
  registerNo = "B221240CS",
  email = "sriya_b221240cs@nitc.ac.in",
  degree = "Bachelor of Technology",
  specialization = "Computer Science",
  yearOfAdmission = "2022",
  dateOfBirth = "1-1-2004",
  hostel = "Mega Ladies Hostel",
  roomNo = "505"
}: StudentProfileProps) => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-200 h-12 mb-4 rounded-md"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-200 h-8 rounded-md"></div>
          <div className="bg-gray-200 h-8 rounded-md"></div>
          <div className="bg-gray-200 h-8 rounded-md"></div>
        </div>
        <div className="mt-6 bg-gray-200 h-64 rounded-md"></div>
      </div>
    );
  }

  const profileData = [
    { label: "Degree", value: degree },
    { label: "Specialization", value: specialization },
    { label: "Year of Admission", value: yearOfAdmission },
    { label: "Date of Birth", value: dateOfBirth },
    { label: "Hostel", value: hostel },
    { label: "Room No", value: roomNo },
  ];

  return (
    <div className="animate-slide-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 bg-gray-200 rounded-lg p-4">
        <div className="text-gray-800">
          <h2 className="text-sm font-medium uppercase text-gray-500">NAME</h2>
          <p className="mt-1 font-medium">{name}</p>
        </div>
        <div className="text-gray-800">
          <h2 className="text-sm font-medium uppercase text-gray-500">REGISTER NO.</h2>
          <p className="mt-1 font-medium">{registerNo}</p>
        </div>
        <div className="text-gray-800">
          <h2 className="text-sm font-medium uppercase text-gray-500">EMAIL</h2>
          <p className="mt-1 font-medium">{email}</p>
        </div>
      </div>
      
      <div className="bg-dashboard-card rounded-lg p-6 shadow-sm">
        <ul className="space-y-4">
          {profileData.map((item, index) => (
            <li 
              key={index} 
              className="flex items-start"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="w-36 text-sm font-medium text-gray-600">{item.label}</span>
              <span className="flex-1 text-gray-800">{item.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentProfile;
