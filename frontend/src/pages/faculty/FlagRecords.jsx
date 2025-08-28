import { useState, useEffect } from "react";
import axios from "axios";
import PageTemplate from "@/components/student/StudentPageTemplate";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Flag, RefreshCw, Loader2, Download, X, ArrowUpDown, Filter, CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComp } from "@/components/ui/calendar";

const API_BASE_URL = "http://localhost:8080/api/main";
const ITEMS_PER_PAGE = 10;

const FlagRecords = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const [approvedRecords, setApprovedRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [flaggingId, setFlaggingId] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [comment, setComment] = useState("");
  const [showFlagCommentModal, setShowFlagCommentModal] = useState(false);
  const [currentRecordToFlag, setCurrentRecordToFlag] = useState(null);
  const { toast } = useToast();

  // Record type options
  const recordTypes = [
    { value: "all", label: "All Types" },
    { value: "TechnicalEvent", label: "Technical Events" },
    { value: "SportsEvent", label: "Sports Events" },
    { value: "CulturalEvent", label: "Cultural Events" },
    { value: "ClubsAndSocieties", label: "Clubs & Societies" },
    { value: "Publications", label: "Publications" },
    { value: "JobOpportunity", label: "Job Opportunities" }
  ];

  // Status options
  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "true", label: "Flagged" },
    { value: "false", label: "Unflagged" }
  ];

  useEffect(() => {
    fetchApprovedRecords();
  }, []);

  const fetchApprovedRecords = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/approved`);
      setApprovedRecords(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch approved records",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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

  const handleSortClick = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleToggleFlag = async (id, currentFlagStatus) => {
    setFlaggingId(id);
    try {
      if (currentFlagStatus) {
        await axios.put(`http://localhost:8080/api/flagged/${id}/restore`);
        toast({
          title: "Success",
          description: "Record unflagged successfully",
        });
      } else {
        await axios.put(`http://localhost:8080/api/flagged/${id}/flag`);
        toast({
          title: "Success",
          description: "Record flagged for deletion",
        });
      }
      fetchApprovedRecords();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${currentFlagStatus ? 'unflag' : 'flag'} record`,
        variant: "destructive",
      });
    } finally {
      setFlaggingId(null);
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
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const handleFlagClick = (record) => {
    setCurrentRecordToFlag(record);
    setShowFlagCommentModal(true);
  };

  const handleUnflagClick = async (id) => {
    setFlaggingId(id);
    try {
      await axios.put(`http://localhost:8080/api/flagged/${id}/restore`);
      toast({
        title: "Success",
        description: "Record unflagged successfully",
      });
      setComment(""); // Clear comment when unflagging
      fetchApprovedRecords();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unflag record",
        variant: "destructive",
      });
    } finally {
      setFlaggingId(null);
    }
  };

  const submitFlagComment = async () => {
    if (!currentRecordToFlag) return;
    
    setFlaggingId(currentRecordToFlag.id);
    try {
      await axios.put(`http://localhost:8080/api/flagged/${currentRecordToFlag.id}/flag`, {
        comment: comment
      });
      toast({
        title: "Success",
        description: "Record flagged for deletion",
      });
      setShowFlagCommentModal(false);
      setComment("");
      fetchApprovedRecords();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to flag record",
        variant: "destructive",
      });
    } finally {
      setFlaggingId(null);
    }
  };

  const formatDtype = (dtype) => {
    if (!dtype) return "N/A";
    
    const typeMap = {
      'TechnicalEvent': 'Technical Event',
      'SportsEvent': 'Sports Event',
      'CulturalEvent': 'Cultural Event',
      'ClubsAndSocieties': 'Clubs & Societies',
      'Publication': 'Publication',
      'JobOpportunity': 'Job Opportunity'
    };
    
    return typeMap[dtype] || dtype.replace(/([A-Z])/g, ' $1').trim();
  };

  // Filter records based on search term, date, type and status
  const filteredRecords = approvedRecords.filter((record) => {
    const matchesSearch = 
      record.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.student?.name && record.student.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (record.student?.rollNo && record.student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDate = !dateFilter || 
      (record.submissionDate && new Date(record.submissionDate).toDateString() === dateFilter.toDateString());
    
    const matchesType = 
      typeFilter === "all" || 
      record.dtype?.toLowerCase() === typeFilter.toLowerCase();
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "true" && record.flag) || 
      (statusFilter === "false" && !record.flag);
    
    return matchesSearch && matchesDate && matchesType && matchesStatus;
  });

  // Sorting logic
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (!sortField) return 0;

    let valueA, valueB;

    if (sortField === "name") {
      valueA = a.student?.name || "";
      valueB = b.student?.name || "";
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
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / ITEMS_PER_PAGE));
  const paginatedRecords = sortedRecords.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="relative">
    <PageTemplate title="Flag Records">

      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by title, name or roll no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Filters Section */}
          <div className="flex gap-2 flex-wrap">
            {/* Date Filter - Fixed button nesting issue */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="pl-3 pr-4">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter ? formatDate(dateFilter) : "Filter by date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComp
                  mode="single"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  initialFocus
                />
                {dateFilter && (
                  <div className="p-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDateFilter(null)}
                      className="w-full"
                    >
                      Clear date
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            {/* Type Filter */}
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none border rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                {recordTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-2.5 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none border rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
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
              onClick={() => {
                setSearchTerm("");
                setDateFilter(null);
                setTypeFilter("all");
                setStatusFilter("all");
              }}
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || dateFilter || typeFilter !== "all" || statusFilter !== "all") && (
          <div className="mb-4 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-500">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                Search: {searchTerm}
                <button 
                  onClick={() => setSearchTerm("")}
                  className="ml-1 p-0.5 rounded-full hover:bg-blue-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {dateFilter && (
              <span className="inline-flex items-center px-2 py-1 text-sm font-medium text-purple-800 bg-purple-100">
                Date: {formatDate(dateFilter)}
                <button 
                  onClick={() => setDateFilter(null)}
                  className="ml-1 p-0.5 hover:bg-purple-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {typeFilter !== "all" && (
              <span className="inline-flex items-center px-2 py-1 text-sm font-medium text-green-800 bg-green-100">
                Type: {recordTypes.find(t => t.value === typeFilter)?.label}
                <button 
                  onClick={() => setTypeFilter("all")}
                  className="ml-1 p-0.5 hover:bg-green-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {statusFilter !== "all" && (
              <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-sm font-medium text-orange-800">
                Status: {statusOptions.find(s => s.value === statusFilter)?.label}
                <button 
                  onClick={() => setStatusFilter("all")}
                  className="ml-1 p-0.5 hover:bg-orange-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  {[
                    { label: "Student Name", field: "name" },
                    { label: "Roll No", field: "rollNo" },
                    { label: "Submission Date", field: "submissionDate" },
                    { label: "Title", field: "title" },
                    { label: "Type", field: "dtype" },
                    { label: "Status", field: "flag" }
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
                {paginatedRecords.length > 0 ? (
                  paginatedRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.student?.name || 'N/A'}</TableCell>
                      <TableCell>{record.student?.rollNo || 'N/A'}</TableCell>
                      <TableCell>{formatDate(record.submissionDate)}</TableCell>
                      <TableCell>{record.title}</TableCell>
                      <TableCell>{formatDtype(record.dtype)}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                          record.flag ? " text-red-800" : "text-gray-600"
                        }`}>
                          {record.flag ? "Flagged" : "Unflagged"}
                        </span>
                      </TableCell>
                      <TableCell>
          <div className="flex gap-2">
            <button
              className="px-2 py-1 bg-blue-100 font-medium text-blue-600 rounded hover:bg-blue-400 text-sm"
              onClick={() => setSelectedRecord(record)}
            >
              VIEW
            </button>
            {record.flag ? (
              <button
                className="px-2 py-1 bg-gray-200 text-gray-600 hover:bg-gray-300 font-medium rounded text-sm"
                onClick={() => handleUnflagClick(record.id)}
                disabled={flaggingId === record.id}
              >
                UNFLAG
              </button>
            ) : (
              <button
                className="px-2 py-1 bg-red-100 text-red-600 hover:bg-red-200 font-medium rounded text-sm"
                onClick={() => handleFlagClick(record)}
              >
                FLAG
              </button>
            )}
          </div>
        </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                      {filteredRecords.length === 0 && approvedRecords.length > 0
                        ? "No records match your filters"
                        : "No approved records found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredRecords.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredRecords.length}</span> results
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
          </>
      </div>

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium text-gray-800">Record Details</h3>
              <button 
                onClick={() => setSelectedRecord(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Common Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-blue-50 p-4 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">STUDENT NAME</h4>
                  <p className="font-medium text-gray-900">{selectedRecord.student?.name || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">ROLL NO</h4>
                  <p className="font-medium text-gray-900">{selectedRecord.student?.rollNo || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">CLASS</h4>
                  <p className="font-medium text-gray-900">{selectedRecord.student?.studentClass || 'N/A'}</p>
                </div>
              </div>

              {/* Record Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-100 p-4 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">TITLE</h4>
                  <p className="font-medium text-gray-900">{selectedRecord.title}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">TYPE</h4>
                  <p className="font-medium text-gray-900">{formatDtype(selectedRecord.dtype)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">STATUS</h4>
                  <p className={`font-medium ${
                    selectedRecord.flag ? "text-red-600" : "text-green-600"
                  }`}>
                    {selectedRecord.flag ? "Flagged" : "Approved"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
                {/* Dynamic Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedRecord).map(([key, value]) => {
                    const skipFields = ['id', 'title', 'documentPath', 'dtype', 
                                      'student', 'faculty', 'flag', 'comments', 
                                      'description', 'comment', 'studentDetails'];
                    
                    if (skipFields.includes(key) || value === null || value === undefined || value === '') {
                      return null;
                    }
                    
                    const isDateField = key.toLowerCase().includes('date');
                    const displayValue = isDateField ? formatDate(value) : value;
                    
                    const displayKey = key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/(^|_)([a-z])/g, (m, p1, p2) => p2.toUpperCase())
                      .trim();
                    
                    return (
                      <div key={key}>
                        <h4 className="text-sm font-medium text-gray-500">{displayKey.toUpperCase()}</h4>
                        <p className="font-medium text-gray-900">{displayValue}</p>
                      </div>
                    );
                  })}
                </div>
                
                {selectedRecord.description && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">DESCRIPTION</h4>
                    <p className="font-medium text-gray-900">{selectedRecord.description}</p>
                  </div>
                )}

                {selectedRecord.achievement && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">ACHIEVEMENT</h4>
                    <p className="font-medium text-gray-900">{selectedRecord.achievement}</p>
                  </div>
                )}
              </div>

              {/* Document download section */}
              {selectedRecord.documentPath && (
                <div className="p-4 rounded-lg border border-blue-50 bg-blue-50">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">ATTACHED DOCUMENT</h4>
                  <Button
                    onClick={() => handleDownload(selectedRecord.id)}
                    variant="outline"
                    className="text-blue-600 hover:bg-blue-100 flex items-center gap-2"
                  >
                    <Download size={16} />
                    Download 
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
          {/* Add Flag Comment Modal */}
          {showFlagCommentModal && currentRecordToFlag && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-medium text-gray-800 mb-4">Add Flag Comment</h3>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 border rounded-md mb-4"
                placeholder="Reason for flagging (required)"
                rows={4}
                required
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={submitFlagComment}
                  disabled={!comment.trim()}
                  className={`px-4 py-2 rounded-md ${
                    !comment.trim() 
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                      : "bg-red-100 hover:bg-red-200 text-red-700"
                  }`}
                >
                  Submit
                </button>
                <button
                  onClick={() => {
                    setShowFlagCommentModal(false);
                    setComment("");
                  }}
                  className="px-4 py-2 bg-gray-400 hover:bg-gray-700 text-white rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </PageTemplate>
    </div>
  );
};

export default FlagRecords;