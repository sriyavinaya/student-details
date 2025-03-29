import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashboardHeader from "@/components/student/StudentDashboardHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const StudentProfiles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [students, setStudents] = useState([]);
  const { toast } = useToast();
  const location = useLocation();
  const facultyId = 101; // Replace with dynamic ID if needed

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/faculty/students`, {
          params: { facultyId },
          headers: { Accept: "application/json" },
        });

        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to fetch students",
          variant: "destructive",
        });
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    if (location.state?.statusFilter) {
      setStatusFilter(location.state.statusFilter);
    }
  }, [location.state]);

  const handleView = (id) => {
    toast({
      title: "Profile View",
      description: `Viewing profile with ID: ${id}`,
    });
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" ? true : student.active === (statusFilter === "Active");
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <DashboardHeader title="Student Profiles" />

      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search profiles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="font-medium">Student Name</TableHead>
              <TableHead className="font-medium">Roll Number</TableHead>
              <TableHead className="font-medium">Class</TableHead>
              <TableHead className="font-medium">Batch</TableHead>
              <TableHead className="font-medium">Action</TableHead>
              <TableHead className="font-medium">Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.rollNo}</TableCell>
                  <TableCell>{student.studentClass}</TableCell>
                  <TableCell>{student.batch}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleView(student.id)}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-1 px-3 rounded text-sm"
                    >
                      VIEW
                    </button>
                  </TableCell>
                  <TableCell className={student.active ? "text-green-600" : "text-red-600"}>
                    {student.active ? "Yes" : "No"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                  No students found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StudentProfiles;




// import { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import DashboardHeader from "@/components/student/StudentDashboardHeader";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Search, Filter } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// const dummyProfiles = [
//   {
//     id: "1",
//     name: "John Doe",
//     rollNumber: "B12345",
//     comments: "All documents verified",
//     status: "Approved"
//   },
//   {
//     id: "2",
//     name: "Jane Smith",
//     rollNumber: "B12346",
//     comments: "Missing academic records",
//     status: "Rejected"
//   },
//   {
//     id: "3",
//     name: "Bob Johnson",
//     rollNumber: "B12347",
//     comments: "Waiting for document verification",
//     status: "Pending"
//   },
//   {
//     id: "4",
//     name: "Alice Williams",
//     rollNumber: "B12348",
//     comments: "All documents verified",
//     status: "Approved"
//   },
//   {
//     id: "5",
//     name: "Charlie Brown",
//     rollNumber: "B12349",
//     comments: "Profile complete",
//     status: "Approved"
//   }
// ];

// const StudentProfiles = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const { toast } = useToast();
//   const location = useLocation();
  
//   useEffect(() => {
//     // Check if location state has a statusFilter
//     if (location.state && location.state.statusFilter) {
//       setStatusFilter(location.state.statusFilter);
//     }
//   }, [location.state]);
  
//   const handleView = (id) => {
//     toast({
//       title: "Profile View",
//       description: `Viewing profile with ID: ${id}`,
//     });
//   };

//   // Filter profiles based on search term and status
//   const filteredProfiles = dummyProfiles.filter(profile => {
//     const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//                           profile.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter ? profile.status === statusFilter : true;
//     return matchesSearch && matchesStatus;
//   });

//   const getStatusColor = (status) => {
//     switch(status) {
//       case "Approved": return "text-green-600";
//       case "Rejected": return "text-red-600";
//       case "Pending": return "text-yellow-600";
//       default: return "";
//     }
//   };

//   return (
//     <div>
//       <DashboardHeader title="Student Profiles" />
      
//       <div className="mb-6 space-y-4">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div className="relative w-full md:w-72">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//             <input
//               type="text"
//               placeholder="Search profiles..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//           </div>
          
//           <div className="relative">
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
//             >
//               <option value="">All Status</option>
//               <option value="Approved">Approved</option>
//               <option value="Rejected">Rejected</option>
//               <option value="Pending">Pending</option>
//             </select>
//             <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//           </div>
//         </div>
//       </div>
      
//       <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-gray-100">
//               <TableHead className="font-medium">Student Name</TableHead>
//               <TableHead className="font-medium">Roll Number</TableHead>
//               <TableHead className="font-medium">Comments</TableHead>
//               <TableHead className="font-medium">Action</TableHead>
//               <TableHead className="font-medium">Status</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredProfiles.length > 0 ? (
//               filteredProfiles.map((profile) => (
//                 <TableRow key={profile.id}>
//                   <TableCell>{profile.name}</TableCell>
//                   <TableCell>{profile.rollNumber}</TableCell>
//                   <TableCell>{profile.comments}</TableCell>
//                   <TableCell>
//                     <button
//                       onClick={() => handleView(profile.id)}
//                       className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-1 px-3 rounded text-sm"
//                     >
//                       VIEW
//                     </button>
//                   </TableCell>
//                   <TableCell className={getStatusColor(profile.status)}>
//                     {profile.status}
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={5} className="text-center py-4 text-gray-500">
//                   No profiles found
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// };

// export default StudentProfiles;