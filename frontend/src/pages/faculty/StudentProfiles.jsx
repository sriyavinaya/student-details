import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import PageTemplate from "@/components/student/StudentPageTemplate";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, X, ArrowUpDown, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 10;

const StudentProfiles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const location = useLocation();
  const { id: facultyId } = useParams();

  // Fetch students data
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/faculty/${facultyId}/students`);
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to fetch students",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [facultyId, toast]);

  // Apply status filter if passed via location state
  useEffect(() => {
    if (location.state?.statusFilter) {
      setStatusFilter(location.state.statusFilter);
    }
  }, [location.state]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showDetailsModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [showDetailsModal]);

  // Handle sorting logic
  const handleSortClick = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  // Handle modal view
  const handleView = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    setSelectedStudent(student);
    setShowDetailsModal(true);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setSortField(null);
    setSortDirection("asc");
    setCurrentPage(1);
  };

  // Filter students based on search term and status
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentClass.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.batch.toString().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "" ? true : student.active === (statusFilter === "Active");
    return matchesSearch && matchesStatus;
  });

  // Sort students based on selected field and direction
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (!sortField) return 0;

    const valueA = a[sortField] || "";
    const valueB = b[sortField] || "";

    if (sortField === "dateOfBirth") {
      return sortDirection === "asc"
        ? new Date(valueA) - new Date(valueB)
        : new Date(valueB) - new Date(valueA);
    }

    if (typeof valueA === "string") {
      return sortDirection === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    } else {
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    }
  });

  // Format date utility function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(sortedStudents.length / ITEMS_PER_PAGE));
  const paginatedStudents = sortedStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="relative">
      <PageTemplate title="Student Profiles">
        {/* Search and Filter Section */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search profiles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none border rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <div className="absolute right-2 top-2.5 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Clear Filters Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="flex items-center gap-1"
              >
                <Filter className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || statusFilter) && (
          <div className="mb-4 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-500">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-full">
                Search: {searchTerm}
                <button 
                  onClick={() => setSearchTerm("")}
                  className="ml-1 p-0.5 rounded-full hover:bg-yellow-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {statusFilter && (
              <span className="inline-flex items-center px-2 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                Status: {statusFilter}
                <button 
                  onClick={() => setStatusFilter("")}
                  className="ml-1 p-0.5 rounded-full hover:bg-blue-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                {[
                  { label: "Student Name", field: "name" },
                  { label: "Roll Number", field: "rollNo" },
                  { label: "Class", field: "studentClass" },
                  { label: "Batch", field: "batch" },
                  { label: "Active", field: "active" },
                ].map(({ label, field }) => (
                  <TableHead key={field} onClick={() => handleSortClick(field)} className="cursor-pointer">
                    <div className="flex items-center gap-1">
                      {label} <ArrowUpDown size={14} className="opacity-50" />
                    </div>
                  </TableHead>
                ))}
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.rollNo}</TableCell>
                    <TableCell>{student.studentClass}</TableCell>
                    <TableCell>{student.batch}</TableCell>
                    <TableCell className={student.active ? "text-green-600" : "text-red-600"}>
                      {student.active ? "Yes" : "No"}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleView(student.id)}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-1 px-3 rounded text-sm"
                      >
                        VIEW
                      </button>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * ITEMS_PER_PAGE, sortedStudents.length)}
              </span>{' '}
              of <span className="font-medium">{sortedStudents.length}</span> results
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="px-2">...</span>
                )}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </Button>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                Last
              </Button>
            </div>
          </div>
        )}

        {/* Student Details Modal */}
        {showDetailsModal && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium text-gray-800">Student Details</h3>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information Section */}
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
                      <p className="font-medium text-gray-900">{selectedStudent.degree || "N/A"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">DEPARTMENT</h4>
                      <p className="font-medium text-gray-900">{selectedStudent.department || "N/A"}</p>
                    </div>
                  </div>
                 
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">EMAIL</h4>
                      <p className="font-medium text-gray-900">{selectedStudent.email || "N/A"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">CLASS</h4>
                      <p className="font-medium text-gray-900">{selectedStudent.studentClass || "N/A"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">CGPA</h4>
                      <p className="font-medium text-gray-900">{selectedStudent.cgpa || "N/A"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">GENDER</h4>
                      <p className="font-medium text-gray-900">{selectedStudent.gender || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">DATE OF BIRTH</h4>
                    <p className="font-medium text-gray-900">
                      {formatDate(selectedStudent.dateOfBirth)}
                    </p>
                  </div>
                </div>

                {/* Address Information Section */}
                <div className="p-4 rounded-lg border border-blue-50 bg-blue-50">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">ADDRESS</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-900">
                    <p><strong>Address:</strong> {selectedStudent.address || "N/A"}</p>
                    <p><strong>City:</strong> {selectedStudent.city || "N/A"}</p>
                    <p><strong>State:</strong> {selectedStudent.state || "N/A"}</p>
                    <p><strong>Postal Code:</strong> {selectedStudent.postalCode || "N/A"}</p>
                    <p><strong>Country:</strong> {selectedStudent.country || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </PageTemplate>
    </div>
  );
};

export default StudentProfiles;