import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DashboardHeader from "@/components/student/StudentDashboardHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "http://localhost:8080/api/faculty";

const ProfileVerification = () => {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [comment, setComment] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showRejectCommentModal, setShowRejectCommentModal] = useState(false);
  const [approvalComment, setApprovalComment] = useState("");
  
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchPendingProfiles();
    }
  }, [id]);

  const fetchPendingProfiles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}/pending-records`);
      setProfiles(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

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
      setShowDetailsModal(false);
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
      setShowDetailsModal(false);
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

  const viewProfileDetails = (profile) => {
    setSelectedProfile(profile);
    setShowDetailsModal(true);
  };

  const filteredProfiles = profiles.filter((profile) =>
    profile.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <DashboardHeader title="Profile Verification" />

      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search events..."
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
              <TableHead className="font-medium">Title</TableHead>
              <TableHead className="font-medium">Category</TableHead>
              <TableHead className="font-medium">Event Date</TableHead>
              <TableHead className="font-medium">Student</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProfiles.length > 0 ? (
              filteredProfiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell>{profile.title}</TableCell>
                  <TableCell>{profile.category}</TableCell>
                  <TableCell>{profile.eventDate}</TableCell>
                  <TableCell>{profile.studentName}</TableCell>
                  <TableCell>{profile.verificationStatus}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => viewProfileDetails(profile)}
                      className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-1 px-3 rounded text-sm"
                    >
                      VIEW
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                  No pending records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Profile Details Modal */}
      {showDetailsModal && selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium text-gray-800">Event Verification Details</h3>
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
                  <h4 className="text-sm font-medium text-gray-500">EVENT TITLE</h4>
                  <p className="font-medium text-gray-900">{selectedProfile.title}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">CATEGORY</h4>
                  <p className="font-medium text-gray-900">{selectedProfile.category}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">STATUS</h4>
                  <p className="font-medium text-gray-900">{selectedProfile.verificationStatus}</p>
                </div>
              </div>

              {/* Event Details Section */}
              <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">STUDENT NAME</h4>
                    <p className="font-medium text-gray-900">{selectedProfile.studentName}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">EVENT DATE</h4>
                    <p className="font-medium text-gray-900">{selectedProfile.eventDate}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">ACHIEVEMENT</h4>
                  <p className="font-medium text-gray-900">{selectedProfile.achievement}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">FACULTY COMMENTS</h4>
                  <p className="font-medium text-gray-900">
                    {selectedProfile.comment || "No comments available"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleApprove(selectedProfile.id)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(selectedProfile.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                >
                  Reject
                </button>
                <button 
                  onClick={() => setShowDetailsModal(false)} 
                  className="px-4 py-2 bg-gray-400 hover:bg-gray-700 text-white rounded-md"
                >
                  Close
                </button>
              </div>
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

// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import DashboardHeader from "@/components/student/StudentDashboardHeader";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Search } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// const API_BASE_URL = "http://localhost:8080/api/faculty";

// const ProfileVerification = () => {
//   const { id } = useParams();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [profiles, setProfiles] = useState([]); // Holds pending records
//   const [selectedProfile, setSelectedProfile] = useState(null);
//   const [comment, setComment] = useState("");
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [showCommentModal, setShowCommentModal] = useState(false); // For approval comments
//   const [showRejectCommentModal, setShowRejectCommentModal] = useState(false); // For rejection comments
//   const [approvalComment, setApprovalComment] = useState(""); // Separate approval comment
  
//   const { toast } = useToast();

//   useEffect(() => {
//     if (id) {
//       fetchPendingProfiles();
//     }
//   }, [id]);
//   const fetchPendingProfiles = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/${id}/pending-records`);
//       setProfiles(response.data); // Update state with pending records
//     } catch (error) {
//       console.error("Error fetching profiles:", error);
//     }
//   };


// const handleApprove = (eventId) => {
//   setSelectedProfile(profiles.find((p) => p.id === eventId) || null);
//   setApprovalComment(""); // Reset approval comment
//   setShowCommentModal(true); // Open approval modal
// };

// const handleReject = (eventId) => {
//   setSelectedProfile(profiles.find((p) => p.id === eventId) || null);
//   setComment(""); // Reset rejection comment
//   setShowRejectCommentModal(true); // Open rejection modal
// };

// const submitComment = async () => {
//   if (!selectedProfile || !comment.trim()) {
//       toast({
//           title: "Error",
//           description: "Comment is required for rejection",
//           variant: "destructive",
//       });
//       return;
//   }

//   try {
//       const response = await axios.put(
//           `${API_BASE_URL}/${id}/reject/${selectedProfile.id}`,
//           { comment: comment.trim() },  // Ensure the correct key "comment"
//           { headers: { "Content-Type": "application/json" } } // Explicit JSON header
//       );

//       setProfiles((prev) => prev.filter((profile) => profile.id !== selectedProfile.id));
//       toast({ title: "Event Rejected", description: `Event ${selectedProfile.id} rejected` });

//       // Reset modal state after rejection
//       setShowCommentModal(false);
//       setShowDetailsModal(false);
//       setComment(""); 
//       setSelectedProfile(null);
//   } catch (error) {
//       console.error("Error rejecting event:", error);
//   }
// };



//   const viewProfileDetails = (profile) => {
//     setSelectedProfile(profile);
//     setShowDetailsModal(true);
//   };

//   const filteredProfiles = profiles.filter((profile) =>
//     profile.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div>
//       <DashboardHeader title="Profile Verification" />

//       <div className="mb-6 space-y-4">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div className="relative w-full md:w-72">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//             <input
//               type="text"
//               placeholder="Search events..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-gray-100">
//               <TableHead className="font-medium">Title</TableHead>
//               <TableHead className="font-medium">Category</TableHead>
//               <TableHead className="font-medium">Event Date</TableHead>
//               <TableHead className="font-medium">Student</TableHead>
//               <TableHead className="font-medium">Status</TableHead>
//               <TableHead className="font-medium">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredProfiles.length > 0 ? (
//               filteredProfiles.map((profile) => (
//                 <TableRow key={profile.id}>
//                   <TableCell>{profile.title}</TableCell>
//                   <TableCell>{profile.category}</TableCell>
//                   <TableCell>{profile.eventDate}</TableCell>
//                   <TableCell>{profile.studentName}</TableCell>
//                   <TableCell>{profile.verificationStatus}</TableCell>
//                   <TableCell>
//                     <button
//                       onClick={() => viewProfileDetails(profile)}
//                       className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-1 px-3 rounded text-sm"
//                     >
//                       VIEW
//                     </button>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={6} className="text-center py-4 text-gray-500">
//                   No pending records found
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Profile Details Modal */}
//       {showDetailsModal && selectedProfile && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
//             <h2 className="text-xl font-semibold mb-4">Event Details</h2>
//             <div className="space-y-2">
//               <p><strong>Title:</strong> {selectedProfile.title}</p>
//               <p><strong>Category:</strong> {selectedProfile.category}</p>
//               <p><strong>Event Date:</strong> {selectedProfile.eventDate}</p>
//               <p><strong>Student:</strong> {selectedProfile.studentName}</p>
//               <p><strong>Achievement:</strong> {selectedProfile.achievement}</p>
//               <p><strong>Verification Status:</strong> {selectedProfile.verificationStatus}</p>
//               <p><strong>Faculty Comments:</strong> {selectedProfile.comment || "None"}</p>
//             </div>

//             <div className="flex justify-end gap-2 mt-4">
//               <button onClick={() => handleApprove(selectedProfile.id)} className="bg-green-500 text-white px-4 py-2 rounded">Approve</button>
//               <button onClick={() => handleReject(selectedProfile.id)} className="bg-red-500 text-white px-4 py-2 rounded">Reject</button>
//               <button onClick={() => setShowDetailsModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Reject Comment Modal */}
//      {/* Approve Comment Modal */}
// {showCommentModal && selectedProfile && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//     <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//       <h2 className="text-xl font-semibold mb-4">Add Approval Comment (Optional)</h2>
//       <textarea
//         value={approvalComment}
//         onChange={(e) => setApprovalComment(e.target.value)}
//         className="w-full p-2 border rounded-md"
//         placeholder="Optional comment for approval"
//       ></textarea>
//       <div className="flex justify-end gap-2 mt-4">
//         <button onClick={submitApproval} className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
//         <button onClick={() => setShowCommentModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
//       </div>
//     </div>
//   </div>
// )}

// {/* Reject Comment Modal */}
// {showRejectCommentModal && selectedProfile && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//     <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//       <h2 className="text-xl font-semibold mb-4">Add Rejection Comment (Required)</h2>
//       <textarea
//         value={comment}
//         onChange={(e) => setComment(e.target.value)}
//         className="w-full p-2 border rounded-md"
//         placeholder="Reason for rejection"
//       ></textarea>
//       <div className="flex justify-end gap-2 mt-4">
//         <button onClick={submitComment} className="bg-red-500 text-white px-4 py-2 rounded">Submit</button>
//         <button onClick={() => setShowRejectCommentModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
//       </div>
//     </div>
//   </div>
// )}

//     </div>
//   );
// };

// export default ProfileVerification;
