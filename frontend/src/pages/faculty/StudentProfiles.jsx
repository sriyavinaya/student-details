import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import DashboardHeader from "@/components/student/StudentDashboardHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const StudentProfiles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { toast } = useToast();
  const location = useLocation();
  const { id: facultyId } = useParams();

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
  }, [facultyId]);

  useEffect(() => {
    if (location.state?.statusFilter) {
      setStatusFilter(location.state.statusFilter);
    }
  }, [location.state]);

  const handleView = (studentId) => {
    const student = students.find(s => s.id === studentId);
    setSelectedStudent(student);
    setShowDetailsModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())||
      student.studentClass.toLowerCase().includes(searchTerm.toLowerCase())||
      student.batch.toString().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" ? true : student.active === (statusFilter === "Active");
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <DashboardHeader title="Student Profiles" />

      {/* Search and Filter Section */}
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

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="font-medium">Student Name</TableHead>
              <TableHead className="font-medium">Roll Number</TableHead>
              <TableHead className="font-medium">Class</TableHead>
              <TableHead className="font-medium">Batch</TableHead>
              <TableHead className="font-medium">Active</TableHead>
              <TableHead className="font-medium">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Loading students...
                </TableCell>
              </TableRow>
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
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
    </div>
  );
};

export default StudentProfiles;




