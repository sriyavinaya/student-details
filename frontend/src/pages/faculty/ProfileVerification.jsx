import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DashboardHeader from "@/components/student/StudentDashboardHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, X, Download, ArrowUpDown, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "http://localhost:8080/api/faculty";
const ITEMS_PER_PAGE = 10;

const ProfileVerification = () => {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [comment, setComment] = useState("");
  const [approvalComment, setApprovalComment] = useState("");
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showRejectCommentModal, setShowRejectCommentModal] = useState(false);
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchPendingProfiles();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return isNaN(date) ? "Invalid Date" : date.toLocaleDateString("en-IN");
    } catch {
      return "N/A";
    }
  };

  const handleSortClick = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const fetchPendingProfiles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}/pending-records`);
      const profilesWithStudents = await Promise.all(
        response.data.map(async (profile) => {
          try {
            const studentResponse = await axios.get(`http://localhost:8080/api/students/${profile.student.id}`);
            return {
              ...profile,
              studentName: `${studentResponse.data.name}`,
              studentDetails: studentResponse.data
            };
          } catch (error) {
            console.error("Error fetching student details:", error);
            return {
              ...profile,
              studentName: "Unknown Student",
              studentDetails: {}
            };
          }
        })
      );
      setProfiles(profilesWithStudents);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  // Filter profiles based on search term
  const filteredProfiles = profiles.filter((profile) =>
    profile.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (profile.student?.rollNo && profile.student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sorting logic
  const sortedProfiles = [...filteredProfiles].sort((a, b) => {
    if (!sortField) return 0;

    let valueA, valueB;

    if (sortField === "name") {
      valueA = a.studentName || "";
      valueB = b.studentName || "";
    } else if (sortField === "rollNo") {
      valueA = a.student?.rollNo || "";
      valueB = b.student?.rollNo || "";
    } else {
      valueA = a[sortField] || "";
      valueB = b[sortField] || "";
    }

    if (sortField === "eventDate" || sortField === "submissionDate") {
      return sortDirection === "asc" ? new Date(valueA) - new Date(valueB) : new Date(valueB) - new Date(valueA);
    }

    if (typeof valueA === "string") {
      return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    } else {
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    }
  });

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(sortedProfiles.length / ITEMS_PER_PAGE));
  const paginatedProfiles = sortedProfiles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleApprove = (eventId) => {
    setSelectedProfile(profiles.find((p) => p.id === eventId) || null);
    setApprovalComment("");
    setShowCommentModal(true);
  };

  const handleReject = (eventId) => {
    setSelectedProfile(profiles.find((p) => p.id === eventId) || null);
    setComment("");
    setShowRejectCommentModal(true);
  };

  const submitApproval = async () => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/${id}/approve/${selectedProfile.id}`,
        { comment: approvalComment.trim() },
        { headers: { "Content-Type": "application/json" } }
      );

      setProfiles((prev) => prev.filter((profile) => profile.id !== selectedProfile.id));
      toast({ 
        title: "Event Approved", 
        description: `Event ${selectedProfile.id} approved successfully` 
      });

      setShowCommentModal(false);
      setApprovalComment("");
      setSelectedProfile(null);
    } catch (error) {
      console.error("Error approving event:", error);
      toast({
        title: "Error",
        description: "Failed to approve event",
        variant: "destructive",
      });
    }
  };

  const submitComment = async () => {
    if (!selectedProfile || !comment.trim()) {
      toast({
        title: "Error",
        description: "Comment is required for rejection",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/${id}/reject/${selectedProfile.id}`,
        { comment: comment.trim() },
        { headers: { "Content-Type": "application/json" } }
      );

      setProfiles((prev) => prev.filter((profile) => profile.id !== selectedProfile.id));
      toast({ 
        title: "Event Rejected", 
        description: `Event ${selectedProfile.id} rejected` 
      });

      setShowRejectCommentModal(false);
      setComment("");
      setSelectedProfile(null);
    } catch (error) {
      console.error("Error rejecting event:", error);
      toast({
        title: "Error",
        description: "Failed to reject event",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (eventId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/main/download/${eventId}`, {
        responseType: "blob",
        withCredentials: true,
      });
  
      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `document_${eventId}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download file");
    }
  };

  return (
    <div className="relative">
      <DashboardHeader title="Profile Verification" />

      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by title, name or roll no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              {[
                { label: "Student Name", field: "name" },
                { label: "Roll No", field: "rollNo" },
                { label: "Submission Date", field: "submissionDate" },
                { label: "Title", field: "title" },
                { label: "Type", field: "dtype" },
                // { label: "Status", field: "verificationStatus" }
              ].map(({ label, field }) => (
                <TableHead key={field} className="cursor-pointer" onClick={() => handleSortClick(field)}>
                  <div className="flex items-center gap-1">
                    {label} <ArrowUpDown size={14} className="opacity-50" />
                  </div>
                </TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProfiles.length > 0 ? (
              paginatedProfiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell>{profile.studentName}</TableCell>
                  <TableCell>{profile.student?.rollNo || 'N/A'}</TableCell>
                  <TableCell>{formatDate(profile.submissionDate)}</TableCell>
                  <TableCell>{profile.title}</TableCell>
                  <TableCell>{profile.dtype || "N/A"}</TableCell>
                  {/* <TableCell>
                    <span className={`text-sm font-semibold ${
                      profile.verificationStatus === 'Approved' ? 'text-green-600' :
                      profile.verificationStatus === 'Rejected' ? 'text-red-600' :
                      'text-yellow-500'
                    }`}>
                      {profile.verificationStatus}
                    </span>
                  </TableCell> */}
                  <TableCell>
                    <div className="flex gap-2">
                      <button
                        className="px-2 py-1 bg-blue-100 font-medium text-blue-600 rounded hover:bg-blue-400 text-sm"
                        onClick={() => setSelectedProfile(profile)}
                      >
                        VIEW
                      </button>
                      {profile.verificationStatus === "Rejected" && (
                        <button
                          className="p-1 text-green-600 hover:text-green-800"
                          onClick={() => handleApprove(profile.id)}
                          title="Resubmit"
                        >
                          <RefreshCw size={18} />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                  No pending records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

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
      </div>

      {/* Record Details Modal - Using the RecordHistoryTable modal pattern */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium text-gray-800">Record Details</h3>
              <button 
                onClick={() => setSelectedProfile(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Common Fields - Always show these */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-blue-50 p-4 rounded-lg">
              <div>
                  <h4 className="text-sm font-medium text-gray-500">STUDENT NAME</h4>
                  <p className="font-medium text-gray-900">{selectedProfile.studentName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">ROLL NO</h4>
                  <p className="font-medium text-gray-900">{selectedProfile.student?.rollNo || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">CLASS</h4>
                  <p className="font-medium text-gray-900">{selectedProfile.studentDetails?.studentClass|| 'N/A'}</p>
                </div>
              </div>

              {/* Student Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-100 p-4 rounded-lg">
              <div>
                  <h4 className="text-sm font-medium text-gray-500">TITLE</h4>
                  <p className="font-medium text-gray-900">{selectedProfile.title}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">TYPE</h4>
                  <p className="font-medium text-gray-900">{selectedProfile.dtype?.replace("Event", " Event") || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">STATUS</h4>
                  <p className={`font-medium ${
                    selectedProfile.verificationStatus === "Pending" ? "text-yellow-600" :
                    selectedProfile.verificationStatus === "Approved" ? "text-green-600" :
                    "text-red-600"
                  }`}>
                    {selectedProfile.verificationStatus}
                  </p>
                </div>
              </div>

              <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
                {/* Dynamic Fields - Only show non-null ones */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedProfile).map(([key, value]) => {
                    // Skip these fields as they're either shown elsewhere or internal
                    const skipFields = ['id', 'title', 'verificationStatus', 'documentPath', 'dtype', 
                                        'student', 'faculty', 'flag', 'comments', 'description', 'comment',
                                        'studentName', 'studentDetails', 'achievement'];
                    
                    if (skipFields.includes(key) || value === null || value === undefined || value === '') {
                      return null;
                    }
                    
                    // Format date fields
                    const isDateField = key.toLowerCase().includes('date');
                    const displayValue = isDateField ? formatDate(value) : value;
                    
                    // Format field name for display
                    const displayKey = key
                      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
                      .replace(/(^|_)([a-z])/g, (m, p1, p2) => p2.toUpperCase()) // Capitalize first letter
                      .trim();
                    
                    return (
                      <div key={key}>
                        <h4 className="text-sm font-medium text-gray-500">{displayKey.toUpperCase()}</h4>
                        <p className="font-medium text-gray-900">{displayValue}</p>
                      </div>
                    );
                  })}
                </div>
                
                {/* Always show description if available */}
                {selectedProfile.description && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">DESCRIPTION</h4>
                    <p className="font-medium text-gray-900">{selectedProfile.description}</p>
                  </div>
                )}

                {/* Always show achievement if available */}
                {selectedProfile.achievement && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">ACHIEVEMENT</h4>
                    <p className="font-medium text-gray-900">{selectedProfile.achievement}</p>
                  </div>
                )}

                {/* Always show comments if available */}
                {/* <div>
                  <h4 className="text-sm font-medium text-gray-500">FACULTY COMMENTS</h4>
                  <p className="font-medium text-gray-900">
                    {selectedProfile.comment || selectedProfile.comments || "No comments available"}
                  </p>
                </div> */}
              </div>

              {/* Document download section */}
              {selectedProfile.documentPath && (
                <div className="p-4 rounded-lg border border-blue-50 bg-blue-50">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">PROOF DOCUMENT</h4>
                  <button
                    onClick={() => handleDownload(selectedProfile.id)}
                    className="px-4 py-2 bg-white text-blue-600 rounded-md border border-blue-200 hover:bg-blue-100 flex items-center gap-2"
                  >
                    <Download size={16} />
                    Download 
                  </button>
                </div>
              )}

              {/* Action Buttons - Only show for pending profiles */}
              {selectedProfile.verificationStatus === "Pending" && (
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleApprove(selectedProfile.id)}
                    className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded-md"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedProfile.id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded-md"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Approve Comment Modal */}
      {showCommentModal && selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Add Approval Comment</h3>
            <textarea
              value={approvalComment}
              onChange={(e) => setApprovalComment(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
              placeholder="Optional comment for approval"
              rows={4}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={submitApproval}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
              >
                Submit
              </button>
              <button
                onClick={() => setShowCommentModal(false)}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-700 text-white rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Comment Modal */}
      {showRejectCommentModal && selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Add Rejection Comment</h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
              placeholder="Reason for rejection (required)"
              rows={4}
              required
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={submitComment}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                Submit
              </button>
              <button
                onClick={() => setShowRejectCommentModal(false)}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-700 text-white rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileVerification;