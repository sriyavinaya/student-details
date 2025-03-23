// import { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import DashboardHeader from "@/components/student/StudentDashboardHeader";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Search, Filter, Eye, X } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// const API_BASE_URL = "http://localhost:8080/api/faculty"; // Change to your actual backend URL

// const ProfileVerification = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [profiles, setProfiles] = useState([]);
//   const [selectedProfile, setSelectedProfile] = useState(null);
//   const [comment, setComment] = useState("");
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [showCommentModal, setShowCommentModal] = useState(false);
//   const { toast } = useToast();
//   const location = useLocation();

//   useEffect(() => {
//     fetchPendingProfiles();
//   }, []);

//   const fetchPendingProfiles = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/pending-records`);
//       const data = await response.json();
//       setProfiles(data);
//     } catch (error) {
//       console.error("Error fetching profiles:", error);
//     }
//   };

//   const handleApprove = async (id) => {
//     try {
//       await fetch(`${API_BASE_URL}/approve/${id}`, { method: "PUT" });
//       setProfiles((prev) => prev.filter((profile) => profile.id !== id)); // Remove from list
//       toast({ title: "Profile Approved", description: `Profile ${id} approved` });
//       setShowDetailsModal(false);
//     } catch (error) {
//       console.error("Error approving profile:", error);
//     }
//   };

//   const handleReject = (id) => {
//     setSelectedProfile(profiles.find((p) => p.id === id) || null);
//     setShowCommentModal(true);
//   };

//   const submitComment = async () => {
//     if (!selectedProfile) return;
//     try {
//       await fetch(`${API_BASE_URL}/reject/${selectedProfile.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ comment }),
//       });
//       setProfiles((prev) => prev.filter((profile) => profile.id !== selectedProfile.id));
//       toast({ title: "Profile Rejected", description: `Profile ${selectedProfile.id} rejected` });
//       setShowCommentModal(false);
//       setComment("");
//       setSelectedProfile(null);
//       setShowDetailsModal(false);
//     } catch (error) {
//       console.error("Error rejecting profile:", error);
//     }
//   };

//   const viewProfileDetails = (profile) => {
//     setSelectedProfile(profile);
//     setShowDetailsModal(true);
//   };

//   const filteredProfiles = profiles.filter((profile) =>
//     profile.name.toLowerCase().includes(searchTerm.toLowerCase())
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
//               placeholder="Search profiles..."
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
//               <TableHead className="font-medium">Student Name</TableHead>
//               <TableHead className="font-medium">Roll Number</TableHead>
//               <TableHead className="font-medium">Category</TableHead>
//               <TableHead className="font-medium">Submission Date</TableHead>
//               <TableHead className="font-medium">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredProfiles.length > 0 ? (
//               filteredProfiles.map((profile) => (
//                 <TableRow key={profile.id}>
//                   <TableCell>{profile.name}</TableCell>
//                   <TableCell>{profile.rollNumber}</TableCell>
//                   <TableCell>{profile.category}</TableCell>
//                   <TableCell>{profile.submissionDate}</TableCell>
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
//                 <TableCell colSpan={5} className="text-center py-4 text-gray-500">
//                   No profiles found
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Profile Details Modal */}
//       {showDetailsModal && selectedProfile && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-xl font-medium">
//                 Student Submission Details
//               </h3>
//               <button 
//                 onClick={() => setShowDetailsModal(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <X size={20} />
//               </button>
//             </div>
            
//             <div className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-100 p-4 rounded-lg">
//                 <div>
//                   <h4 className="text-sm font-medium text-gray-500">NAME</h4>
//                   <p className="font-medium">{selectedProfile.name}</p>
//                 </div>
//                 <div>
//                   <h4 className="text-sm font-medium text-gray-500">ROLL NUMBER</h4>
//                   <p className="font-medium">{selectedProfile.rollNumber}</p>
//                 </div>
//                 <div>
//                   <h4 className="text-sm font-medium text-gray-500">CATEGORY</h4>
//                   <p className="font-medium">{selectedProfile.category}</p>
//                 </div>
//               </div>
              
//               <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
//                 <div>
//                   <h4 className="text-sm font-medium text-gray-500">DESCRIPTION</h4>
//                   <p>{selectedProfile.description}</p>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <h4 className="text-sm font-medium text-gray-500">DATE OF EVENT</h4>
//                     <p>{selectedProfile.dateOfEvent}</p>
//                   </div>
//                   <div>
//                     <h4 className="text-sm font-medium text-gray-500">SUBMISSION DATE</h4>
//                     <p>{selectedProfile.submissionDate}</p>
//                   </div>
//                 </div>
//                 <div>
//                   <h4 className="text-sm font-medium text-gray-500">ACHIEVEMENTS</h4>
//                   <p>{selectedProfile.achievements}</p>
//                 </div>
//                 <div>
//                   <h4 className="text-sm font-medium text-gray-500">CERTIFICATE</h4>
//                   <div className="mt-2">
//                     <a 
//                       href="#" 
//                       className="inline-flex items-center text-blue-600 hover:text-blue-800"
//                       onClick={(e) => e.preventDefault()}
//                     >
//                       {selectedProfile.certificate}
//                       <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
//                     </a>
//                   </div>
//                 </div>
//               </div>

//       {/* Reject Comment Modal */}
//       {showCommentModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-xl font-semibold mb-4">Add Rejection Comment</h2>
//             <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full p-2 border rounded-md"></textarea>
//             <div className="flex justify-end gap-2 mt-4">
//               <button onClick={submitComment} className="bg-red-500 text-white px-4 py-2 rounded">Submit</button>
//               <button onClick={() => setShowCommentModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfileVerification;

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashboardHeader from "@/components/student/StudentDashboardHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Eye, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "http://localhost:8080/api/faculty"; // Change to your actual backend URL

const ProfileVerification = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [comment, setComment] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    fetchPendingProfiles();
  }, []);

  const fetchPendingProfiles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pending-records`);
      const data = await response.json();
      setProfiles(data);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/approve/${id}`, { method: "PUT" });
      setProfiles((prev) => prev.filter((profile) => profile.id !== id)); // Remove from list
      toast({ title: "Profile Approved", description: `Profile ${id} approved` });
      setShowDetailsModal(false);
    } catch (error) {
      console.error("Error approving profile:", error);
    }
  };

  const handleReject = (id) => {
    setSelectedProfile(profiles.find((p) => p.id === id) || null);
    setShowCommentModal(true);
  };

  const submitComment = async () => {
    if (!selectedProfile) return;
    try {
      await fetch(`${API_BASE_URL}/reject/${selectedProfile.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment }),
      });
      setProfiles((prev) => prev.filter((profile) => profile.id !== selectedProfile.id));
      toast({ title: "Profile Rejected", description: `Profile ${selectedProfile.id} rejected` });
      setShowCommentModal(false);
      setComment("");
      setSelectedProfile(null);
      setShowDetailsModal(false);
    } catch (error) {
      console.error("Error rejecting profile:", error);
    }
  };

  const viewProfileDetails = (profile) => {
    setSelectedProfile(profile);
    setShowDetailsModal(true);
  };

  const filteredProfiles = profiles.filter((profile) =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase())
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
              placeholder="Search profiles..."
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
              <TableHead className="font-medium">Student Name</TableHead>
              <TableHead className="font-medium">Roll Number</TableHead>
              <TableHead className="font-medium">Category</TableHead>
              <TableHead className="font-medium">Submission Date</TableHead>
              <TableHead className="font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProfiles.length > 0 ? (
              filteredProfiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell>{profile.name}</TableCell>
                  <TableCell>{profile.rollNumber}</TableCell>
                  <TableCell>{profile.category}</TableCell>
                  <TableCell>{profile.submissionDate}</TableCell>
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
                <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                  No profiles found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Profile Details Modal */}
      {showDetailsModal && selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
            <p><strong>Name:</strong> {selectedProfile.name}</p>
            <p><strong>Roll Number:</strong> {selectedProfile.rollNumber}</p>
            <p><strong>Category:</strong> {selectedProfile.category}</p>
            <p><strong>Submission Date:</strong> {selectedProfile.submissionDate}</p>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => handleApprove(selectedProfile.id)} className="bg-green-500 text-white px-4 py-2 rounded">Approve</button>
              <button onClick={() => handleReject(selectedProfile.id)} className="bg-red-500 text-white px-4 py-2 rounded">Reject</button>
              <button onClick={() => setShowDetailsModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add Rejection Comment</h2>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full p-2 border rounded-md"></textarea>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={submitComment} className="bg-red-500 text-white px-4 py-2 rounded">Submit</button>
              <button onClick={() => setShowCommentModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileVerification; 