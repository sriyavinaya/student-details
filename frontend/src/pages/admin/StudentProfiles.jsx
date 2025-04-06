import { useState, useEffect } from "react";
import axios from "axios";
import DashboardHeader from "@/components/student/StudentDashboardHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, X, ArrowUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageTemplate from "@/components/student/StudentPageTemplate";


const API_BASE_URL = "http://localhost:8080/api/admin/all-students";
const ITEMS_PER_PAGE = 10;

const StudentProfiles = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  // Fetch all students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setStudents(response.data); 
    } catch (error) {
      console.error("Error fetching students:", error);
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive",
      });
    }
  };

  const handleSortClick = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handleView = (student) => {
    setSelectedStudent(student);
  };

  const closeModal = () => {
    setSelectedStudent(null);
  };

  // Filter students based on search term and active status
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter ? student.active === (statusFilter === "Active") : true;
    return matchesSearch && matchesStatus;
  });

  // Sort students based on selected field and direction
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (!sortField) return 0;

    const valueA = a[sortField] || "";
    const valueB = b[sortField] || "";

    if (typeof valueA === "string") {
      return sortDirection === "asc" 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    } else if (sortField === "active") {
      return sortDirection === "asc" 
        ? (a.active === b.active ? 0 : a.active ? -1 : 1)
        : (a.active === b.active ? 0 : a.active ? 1 : -1);
    } else {
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    }
  });

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(sortedStudents.length / ITEMS_PER_PAGE));
  const paginatedStudents = sortedStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusColor = (active) => {
    return active ? "text-green-600" : "text-red-600";
  };

  const toggleUserStatus = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/admin/users/${id}/toggle-status`);
      toast({ title: response.data });
      setStudents((prevStudents) =>
        prevStudents.map((stu) =>
          stu.id === id ? { ...stu, active: !stu.active } : stu
        )
      );
      if (selectedStudent && selectedStudent.id === id) {
        setSelectedStudent((prev) => ({ ...prev, active: !prev.active }));
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast({ title: "Failed to update status", variant: "destructive" });
    }
  };

  return (
    <PageTemplate title="Student Profiles">

      
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search students..."
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
              {[
                { label: "Student Name", field: "name" },
                { label: "Roll Number", field: "rollNo" },
                { label: "Department", field: "department" },
                { label: "Status", field: "active" },
              ].map(({ label, field }) => (
                <TableHead 
                  key={field} 
                  className="cursor-pointer" 
                  onClick={() => handleSortClick(field)}
                >
                  <div className="flex items-center gap-1">
                    {label} <ArrowUpDown size={14} className="opacity-50" />
                  </div>
                </TableHead>
              ))}
              <TableHead className="font-medium">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStudents.length > 0 ? (
              paginatedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.rollNo}</TableCell>
                  <TableCell>{student.department}</TableCell>
                  <TableCell className={getStatusColor(student.active)}>
                    {student.active ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleView(student)}
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

      {/* Pagination */}
      <div className="flex justify-between items-center p-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium text-gray-800">Student Details</h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Student Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-100 p-4 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">STUDENT NAME</h4>
                  <p className="font-medium text-gray-900">{selectedStudent.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">ROLL NUMBER</h4>
                  <p className="font-medium text-gray-900">{selectedStudent.rollNo}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">STATUS</h4>
                  <p className={`font-medium ${selectedStudent.active ? "text-green-700" : "text-red-700"}`}>
                    {selectedStudent.active ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>

              {/* Academic Details Section */}
              <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">DEGREE</h4>
                    <p className="font-medium text-gray-900">{selectedStudent.degree}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">DEPARTMENT</h4>
                    <p className="font-medium text-gray-900">{selectedStudent.department}</p>
                  </div>
                </div>
               
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">EMAIL</h4>
                    <p className="font-medium text-gray-900">{selectedStudent.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">CLASS</h4>
                    <p className="font-medium text-gray-900">{selectedStudent.studentClass}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">CGPA</h4>
                    <p className="font-medium text-gray-900">{selectedStudent.cgpa}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">GENDER</h4>
                    <p className="font-medium text-gray-900">{selectedStudent.gender}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">DATE OF BIRTH</h4>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedStudent.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Faculty Information Section */}
              {selectedStudent.faculty && (
                <div className="p-4 rounded-lg border border-blue-50 bg-blue-50">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">FACULTY ADVISOR</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-900">
                    <p><strong>Faculty ID:</strong> {selectedStudent.faculty.faId}</p>
                    <p><strong>Name:</strong> {selectedStudent.faculty.name}</p>
                    <p><strong>Email:</strong> {selectedStudent.faculty.email}</p>
                    <p><strong>Phone:</strong> {selectedStudent.faculty.phone}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => toggleUserStatus(selectedStudent.id)}
                  className={`px-4 py-2 ${selectedStudent.active ? "bg-red-100 text-red-700" : "bg-green-600 text-white"} rounded-md`}
                >
                  {selectedStudent.active ? "Deactivate" : "Reactivate"}
                </button>
                <button 
                  onClick={closeModal} 
                  className="px-4 py-2 bg-gray-400 hover:bg-gray-700 text-white rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageTemplate>
  );
};

export default StudentProfiles;