import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, Download, RefreshCw, Search, Filter, CalendarIcon,X} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComp } from "@/components/ui/calendar";

const ITEMS_PER_PAGE = 10;

const RecordHistoryTable = ({ 
  records = [], 
  onResubmit,
  onDownload,
  onView
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);

  const recordTypes = [
    { value: "all", label: "All Types" },
    { value: "TechnicalEvent", label: "Technical Events" },
    { value: "SportsEvent", label: "Sports Events" },
    { value: "CulturalEvent", label: "Cultural Events" },
    { value: "ClubsAndSocieties", label: "Clubs & Societies" },
    { value: "Publications", label: "Publications" },
    { value: "JobOpportunity", label: "Job Opportunities" }
  ];

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "Pending", label: "Pending" },
    { value: "Rejected", label: "Rejected" }
  ];


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

  // Filter records based on search term and filters
  const filteredRecords = records.filter((record) => {
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
      (statusFilter === "Pending" && record.verificationStatus === "Pending") || 
      (statusFilter === "Rejected" && record.verificationStatus === "Rejected");
    
    return matchesSearch && matchesDate && matchesType && matchesStatus;
  });


  // Sorting logic
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (!sortField) return 0;

    const valueA = a[sortField] || "";
    const valueB = b[sortField] || "";

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

  const formatDtype = (dtype) => {
    if (!dtype) return "N/A";
    
    const typeMap = {
      'TechnicalEvent': 'Technical Event',
      'SportsEvent': 'Sports Event',
      'CulturalEvent': 'Cultural Event',
      'ClubsAndSocieties': 'Clubs & Societies'
    };
    
    return typeMap[dtype] || dtype.replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Search and Filter Header */}
      <div className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by title..."
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
   

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            {[
              { label: "Title", field: "title" },
              { label: "Submission Date", field: "submissionDate" },
              { label: "Type", field: "dtype" },
              { label: "Status", field: "verificationStatus" },
              { label: "Comments", field: "comments" }
            ].map(({ label, field }) => (
              <TableHead key={field} className="cursor-pointer" onClick={() => handleSortClick(field)}>
                <div className="flex items-center gap-1">
                  {label} 
                  {sortField === field && (
                    <ArrowUpDown size={14} className={sortDirection === "asc" ? "" : "transform rotate-180"} />
                  )}
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
                <TableCell>{record.title}</TableCell>
                <TableCell>{formatDate(record.submissionDate)}</TableCell>
                <TableCell>{formatDtype(record.dtype)}</TableCell>
                <TableCell>
                  <span className={`text-sm font-semibold ${
                    record.verificationStatus === "Pending" ? "text-yellow-500" :
                    record.verificationStatus === "Approved" ? "text-green-600" :
                    "text-red-600"
                  }`}>
                    {record.verificationStatus}
                  </span>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {record.comments || "No comments"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <button
                      className="px-2 py-1 bg-blue-100 font-medium text-blue-600 rounded hover:bg-blue-400 text-sm"
                      onClick={() => setSelectedRecord(record)}
                    >
                      VIEW
                    </button>

                    {record.verificationStatus === "Rejected" && (
                      <button
                        className="px-2 py-1 bg-green-100 font-medium text-green-600 rounded hover:bg-green-200 text-sm"
                        onClick={() => onResubmit(record)}
                        title="Resubmit"
                      >
                        RESUBMIT
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>

            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                {records.length === 0 ? "No records found" : "No records match your filters"}
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
          ✕
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Common Fields - Always show these */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-100 p-4 rounded-lg">
          <div>
            <h4 className="text-sm font-medium text-gray-500">TITLE</h4>
            <p className="font-medium text-gray-900">{selectedRecord.title}</p>
          </div>
          <div>
          <h4 className="text-sm font-medium text-gray-500">RECORD TYPE</h4>
          <p className="font-medium text-gray-900">
            {formatDtype(selectedRecord.dtype)}
          </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">STATUS</h4>
            <p className={`font-medium ${
              selectedRecord.verificationStatus === "Pending" ? "text-yellow-600" :
              selectedRecord.verificationStatus === "Approved" ? "text-green-600" :
              "text-red-600"
            }`}>
              {selectedRecord.verificationStatus}
            </p>
          </div>
        </div>

        <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
          {/* Dynamic Fields - Only show non-null ones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(selectedRecord).map(([key, value]) => {
              // Skip these fields as they're either shown elsewhere or internal
              const skipFields = ['id', 'title', 'verificationStatus', 'documentPath', 'dtype', 
                                  'student', 'faculty', 'flag', 'comments', 'description'];
              
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
          {selectedRecord.description && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">DESCRIPTION</h4>
              <p className="font-medium text-gray-900">{selectedRecord.description}</p>
            </div>
          )}

          {/* Always show comments if available */}
          <div>
            <h4 className="text-sm font-medium text-gray-500">FACULTY COMMENTS</h4>
            <p className="font-medium text-gray-900">
              {selectedRecord.comments || "No comments available"}
            </p>
          </div>
        </div>

        {/* Document download section */}
        {selectedRecord.documentPath && (
          <div className="p-4 rounded-lg border border-blue-50 bg-blue-50">
            <h4 className="text-sm font-medium text-blue-800 mb-2">ATTACHED DOCUMENT</h4>
            <button
              onClick={() => onDownload(selectedRecord.id)}
              className="px-4 py-2 bg-white text-blue-600 rounded-md border border-blue-200 hover:bg-blue-100 flex items-center gap-2"
            >
              <Download size={16} />
              Download 
            </button>
          </div>
        )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordHistoryTable;