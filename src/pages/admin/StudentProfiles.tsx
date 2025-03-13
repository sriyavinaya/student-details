
import { useState } from "react";
import DashboardHeader from "@/components/student/StudentDashboardHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudentProfile {
  id: string;
  name: string;
  rollNumber: string;
  department: string;
  status: "Active" | "Inactive";
}

const dummyProfiles: StudentProfile[] = [
  {
    id: "1",
    name: "John Doe",
    rollNumber: "B12345",
    department: "Computer Science",
    status: "Active"
  },
  {
    id: "2",
    name: "Jane Smith",
    rollNumber: "B12346",
    department: "Electrical Engineering",
    status: "Active"
  },
  {
    id: "3",
    name: "Bob Johnson",
    rollNumber: "B12347",
    department: "Mechanical Engineering",
    status: "Inactive"
  },
  {
    id: "4",
    name: "Alice Williams",
    rollNumber: "B12348",
    department: "Civil Engineering",
    status: "Active"
  },
  {
    id: "5",
    name: "Charlie Brown",
    rollNumber: "B12349",
    department: "Information Technology",
    status: "Active"
  }
];

const StudentProfiles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { toast } = useToast();
  
  const handleView = (id: string) => {
    toast({
      title: "Student Profile View",
      description: `Viewing student profile with ID: ${id}`,
    });
  };

  // Filter profiles based on search term and status
  const filteredProfiles = dummyProfiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          profile.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          profile.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? profile.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Active": return "text-green-600";
      case "Inactive": return "text-red-600";
      default: return "";
    }
  };

  return (
    <div>
      <DashboardHeader title="Student Profiles" />
      
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search student profiles..."
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
              <TableHead className="font-medium">Department</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProfiles.length > 0 ? (
              filteredProfiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell>{profile.name}</TableCell>
                  <TableCell>{profile.rollNumber}</TableCell>
                  <TableCell>{profile.department}</TableCell>
                  <TableCell className={getStatusColor(profile.status)}>
                    {profile.status}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleView(profile.id)}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-1 px-3 rounded text-sm"
                    >
                      VIEW
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                  No student profiles found
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
