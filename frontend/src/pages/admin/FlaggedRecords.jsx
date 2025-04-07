import { useState, useEffect } from "react";
import DashboardHeader from "@/components/student/StudentDashboardHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, Filter, X, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/flagged";

const FlaggedRecords = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchFlaggedRecords();
  }, []);

  const fetchFlaggedRecords = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_BASE_URL);
      setRecords(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch flagged records",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`${API_BASE_URL}/${id}/delete-permanently`);
      setRecords(prevRecords => prevRecords.filter(record => record.id !== id));
      toast({
        title: "Record Deleted",
        description: "Record has been permanently deleted.",
      });
      setShowDetailsModal(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete record",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete ALL flagged records? This action cannot be undone.")) {
      return;
    }

    setIsDeletingAll(true);
    try {
      // Delete records one by one to ensure all are processed
      for (const record of records) {
        await axios.delete(`${API_BASE_URL}/${record.id}/delete-permanently`);
      }
      setRecords([]);
      toast({
        title: "Success",
        description: "All flagged records have been deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete some records. Please try again.",
        variant: "destructive",
      });
      // Refresh the list to show remaining records
      fetchFlaggedRecords();
    } finally {
      setIsDeletingAll(false);
    }
  };

  const handleRestore = async (id) => {
    setDeletingId(id);
    try {
      await axios.put(`${API_BASE_URL}/${id}/restore`);
      setRecords(prevRecords => prevRecords.filter(record => record.id !== id));
      toast({
        title: "Record Restored",
        description: "Record has been restored and removed from flagged list.",
      });
      setShowDetailsModal(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to restore record",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const viewRecordDetails = (record) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  // Filter records based on search term and type
  const filteredRecords = records.filter(record => {
    const studentName = record.student?.name || '';
    const rollNumber = record.student?.rollNo || '';
    const matchesSearch = 
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter ? record.dtype === typeFilter : true;
    return matchesSearch && matchesType;
  });

  const recordTypes = Array.from(new Set(records.map(r => r.dtype)));

  const getRecordTypeColor = (type) => {
    switch(type) {
      case "TechnicalEvent": return "bg-blue-100 text-blue-800";
      case "CulturalEvent": return "bg-purple-100 text-purple-800";
      case "SportsEvent": return "bg-green-100 text-green-800";
      case "ClubsAndSocieties": return "bg-yellow-100 text-yellow-800";
      case "Publications": return "bg-indigo-100 text-indigo-800";
      case "JobOpportunity": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDtype = (dtype) => {
    if (!dtype) return "N/A";
    
    const typeMap = {
      'TechnicalEvent': 'Technical Event',
      'SportsEvent': 'Sports Event',
      'CulturalEvent': 'Cultural Event',
      'ClubsAndSocieties': 'Clubs & Societies',
      'Publications': 'Publication',
      'JobOpportunity': 'Job Opportunity'
    };
    
    return typeMap[dtype] || dtype.replace(/([A-Z])/g, ' $1').trim();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return isNaN(date) ? "Invalid Date" : date.toLocaleDateString("en-IN");
    } catch {
      return "N/A";
    }
  };

  return (
    <div>
      <DashboardHeader title="Flagged Records" />
      
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
              >
                <option value="">All Record Types</option>
                {recordTypes.map(type => (
                  <option key={type} value={type}>{formatDtype(type)}</option>
                ))}
              </select>
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>

            {records.length > 0 && (
              <button
                onClick={handleDeleteAll}
                disabled={isDeletingAll}
                className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                  isDeletingAll 
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                    : "bg-red-100 hover:bg-red-200 text-red-700"
                }`}
              >
                {isDeletingAll ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete All
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="font-medium">Student Name</TableHead>
                <TableHead className="font-medium">Roll Number</TableHead>
                <TableHead className="font-medium">Record Type</TableHead>
                <TableHead className="font-medium">Title</TableHead>
                <TableHead className="font-medium">Flagged Date</TableHead>
                <TableHead className="font-medium">Comment</TableHead>
                <TableHead className="font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.student?.name || 'N/A'}</TableCell>
                    <TableCell>{record.student?.rollNo || 'N/A'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRecordTypeColor(record.dtype)}`}>
                        {formatDtype(record.dtype)}
                      </span>
                    </TableCell>
                    <TableCell>{record.title}</TableCell>
                    <TableCell>{formatDate(record.updatedAt)}</TableCell>
                    <TableCell className="max-w-xs truncate" title={record.comment}>
                      {record.comment || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewRecordDetails(record)}
                          className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          disabled={deletingId === record.id}
                          className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-full"
                          title="Delete Permanently"
                        >
                          {deletingId === record.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                    {records.length === 0 ? "No flagged records found" : "No records match your filters"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
      
      {/* Details Modal */}
      {showDetailsModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium">
                Flagged Record Details
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
                  <h4 className="text-sm font-medium text-gray-500">STUDENT NAME</h4>
                  <p className="font-medium">{selectedRecord.student?.name || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">ROLL NUMBER</h4>
                  <p className="font-medium">{selectedRecord.student?.rollNo || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">RECORD TYPE</h4>
                  <p className="font-medium">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRecordTypeColor(selectedRecord.dtype)}`}>
                      {formatDtype(selectedRecord.dtype)}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">TITLE</h4>
                  <p>{selectedRecord.title}</p>
                </div>
                {selectedRecord.description && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">DESCRIPTION</h4>
                    <p>{selectedRecord.description}</p>
                  </div>
                )}
                {selectedRecord.eventDate && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">EVENT DATE</h4>
                    <p>{formatDate(selectedRecord.eventDate)}</p>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-medium text-gray-500">FLAGGED DATE</h4>
                  <p>{formatDate(selectedRecord.updatedAt)}</p>
                </div>
              </div>
              
              {selectedRecord.comment && (
                <div className="p-4 rounded-lg border border-red-200 bg-red-50">
                  <h4 className="text-sm font-medium text-red-800 mb-2">FLAG COMMENT</h4>
                  <p className="text-red-700">{selectedRecord.comment}</p>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleDelete(selectedRecord.id)}
                  disabled={deletingId === selectedRecord.id}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                    deletingId === selectedRecord.id
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-red-100 hover:bg-red-200 text-red-700"
                  }`}
                >
                  {deletingId === selectedRecord.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Delete Permanently
                </button>
                <button
                  onClick={() => handleRestore(selectedRecord.id)}
                  disabled={deletingId === selectedRecord.id}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                    deletingId === selectedRecord.id
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {deletingId === selectedRecord.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  Restore Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlaggedRecords;