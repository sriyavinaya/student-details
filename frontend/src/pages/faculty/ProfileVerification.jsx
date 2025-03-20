import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashboardHeader from "@/components/student/StudentDashboardHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Eye, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const dummyProfiles = [
  {
    id: "1",
    name: "John Doe",
    rollNumber: "B12345",
    category: "Technical",
    submissionDate: "15/05/2023",
    status: "Pending",
    description: "Participated in IEEE Code Hackathon 2023",
    dateOfEvent: "10/05/2023",
    certificate: "certificate1.pdf",
    achievements: "First place in web development category"
  },
  {
    id: "2",
    name: "Jane Smith",
    rollNumber: "B12346",
    category: "Cultural",
    submissionDate: "16/05/2023",
    status: "Pending",
    description: "Performed in Annual College Cultural Fest",
    dateOfEvent: "05/05/2023",
    certificate: "certificate2.pdf",
    achievements: "Best Vocalist Award"
  },
  {
    id: "3",
    name: "Bob Johnson",
    rollNumber: "B12347",
    category: "Sports",
    submissionDate: "17/05/2023",
    status: "Pending",
    description: "Inter-college Basketball Tournament",
    dateOfEvent: "01/05/2023",
    certificate: "certificate3.pdf",
    achievements: "Runner-up"
  },
  {
    id: "4",
    name: "Alice Williams",
    rollNumber: "B12348",
    category: "Clubs",
    submissionDate: "18/05/2023",
    status: "Rejected",
    description: "Robotics Club Project Showcase",
    dateOfEvent: "12/05/2023",
    certificate: "certificate4.pdf",
    achievements: "Best Innovation Award"
  },
  {
    id: "5",
    name: "Charlie Brown",
    rollNumber: "B12349",
    category: "Technical",
    submissionDate: "19/05/2023",
    status: "Rejected",
    description: "AI Conference Paper Presentation",
    dateOfEvent: "15/05/2023",
    certificate: "certificate5.pdf",
    achievements: "Paper selected for publication"
  }
];

const ProfileVerification = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [profiles, setProfiles] = useState(dummyProfiles);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [comment, setComment] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const { toast } = useToast();
  const location = useLocation();
  
  useEffect(() => {
    // Check if location state has a statusFilter
    if (location.state && location.state.statusFilter) {
      setStatusFilter(location.state.statusFilter);
    }
  }, [location.state]);
  
  const handleApprove = (id) => {
    setProfiles(prevProfiles => 
      prevProfiles.map(profile => 
        profile.id === id ? {...profile, status: "Approved" } : profile
      )
    );
    toast({
      title: "Profile Approved",
      description: `Profile ${id} has been approved`,
    });
    setShowDetailsModal(false);
  };
  
  const handleReject = (id) => {
    setSelectedProfile(profiles.find(p => p.id === id) || null);
    setShowCommentModal(true);
  };
  
  const submitComment = () => {
    if (!selectedProfile) return;
    
    if (selectedProfile.status === "Pending") {
      setProfiles(prevProfiles => 
        prevProfiles.map(profile => 
          profile.id === selectedProfile.id ? {...profile, status: "Rejected" } : profile
        )
      );
      toast({
        title: "Profile Rejected",
        description: `Profile ${selectedProfile.id} has been rejected with comment`,
      });
    } else {
      toast({
        title: "Comment Added",
        description: `Comment added to profile ${selectedProfile.id}`,
      });
    }
    
    setShowCommentModal(false);
    setComment("");
    setSelectedProfile(null);
    setShowDetailsModal(false);
  };

  const viewProfileDetails = (profile) => {
    setSelectedProfile(profile);
    setShowDetailsModal(true);
  };

  // Filter profiles based on search term, category, and status
  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          profile.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? profile.category === categoryFilter : true;
    const matchesStatus = statusFilter ? profile.status === statusFilter : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(profiles.map(p => p.category)));

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
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
              >
                <option value="">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Pending">Pending</option>
              </select>
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
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
              <TableHead className="font-medium">Status</TableHead>
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
                      title="View Details"
                    >
                      VIEW
                    </button>
                  </TableCell>
                  <TableCell>
                    <span className={
                      profile.status === "Approved" ? "text-green-600" : 
                      profile.status === "Rejected" ? "text-red-600" : 
                      "text-yellow-600"
                    }>
                      {profile.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                  No profiles found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Details Modal */}
      {showDetailsModal && selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium">
                Student Submission Details
              </h3>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-100 p-4 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">NAME</h4>
                  <p className="font-medium">{selectedProfile.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">ROLL NUMBER</h4>
                  <p className="font-medium">{selectedProfile.rollNumber}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">CATEGORY</h4>
                  <p className="font-medium">{selectedProfile.category}</p>
                </div>
              </div>
              
              <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">DESCRIPTION</h4>
                  <p>{selectedProfile.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">DATE OF EVENT</h4>
                    <p>{selectedProfile.dateOfEvent}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">SUBMISSION DATE</h4>
                    <p>{selectedProfile.submissionDate}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">ACHIEVEMENTS</h4>
                  <p>{selectedProfile.achievements}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">CERTIFICATE</h4>
                  <div className="mt-2">
                    <a 
                      href="#" 
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                      onClick={(e) => e.preventDefault()}
                    >
                      {selectedProfile.certificate}
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </a>
                  </div>
                </div>
              </div>
              
              {selectedProfile.status === "Pending" && (
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleReject(selectedProfile.id)}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selectedProfile.id)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                  >
                    Approve
                  </button>
                </div>
              )}
              
              {selectedProfile.status !== "Pending" && (
                <div className="pt-4 border-t border-gray-200">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedProfile.status === "Approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {selectedProfile.status}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Comment Modal */}
      {showCommentModal && selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-medium mb-4">
              Reject Profile
            </h3>
            <p className="mb-2 text-gray-600">Profile: {selectedProfile.name} ({selectedProfile.rollNumber})</p>
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                Reason for rejection
              </label>
              <textarea
                id="comment"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your comment here..."
              ></textarea>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowCommentModal(false);
                  setComment("");
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={submitComment}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md"
                disabled={!comment.trim()}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileVerification;