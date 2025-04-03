import React, { useState, useEffect } from "react";
import PageTemplate from "@/components/student/StudentPageTemplate";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, Eye, Download, RefreshCw , Search} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useParams } from "react-router-dom";
import TechnicalEventsForm from "@/components/student/forms/TechnicalEventsForm";

const ITEMS_PER_PAGE = 10;

const RecordHistoryTable = ({ records = [], onResubmit }) => {
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState(null);

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

  const handleDownload = async (recordId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/main/download/${recordId}`, {
        responseType: "blob",
        withCredentials: true,
      });
      console.log(response);
  
      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `document_${recordId}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download file");
    }
  };

  // Sorting logic
  const sortedRecords = [...records].sort((a, b) => {
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
  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / ITEMS_PER_PAGE));
  const paginatedRecords = sortedRecords.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const formatDtype = (dtype) => {
    if (!dtype) return "N/A";
    
    // Special cases for your specific dtype values
    const specialCases = {
      'ClubsAndSocieties': 'Clubs & Societies',
      'TechnicalEvent': 'Technical Event',
      'SportsEvent': 'Sports Event',
      'CulturalEvent': 'Cultural Event',

      // Add other special cases as needed
    };
    
    // First check special cases, then try general formatting
    return specialCases[dtype] || 
      dtype
        .replace(/([A-Z][a-z]+)/g, ' $1')  // Handle PascalCase
        .replace(/([A-Z]{2,})/g, ' $1')    // Handle acronyms
        .replace(/_/g, ' ')                // Handle underscores
        .replace(/Event$/, '')             // Remove trailing "Event"
        .replace(/^ /, '')                 // Trim leading space
        .replace(/\b\w/g, first => first.toUpperCase()) // Capitalize words
        .trim();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                <TableCell>{record.title}</TableCell>
                <TableCell>{formatDate(record.submissionDate)}</TableCell>
                <TableCell>
                  {formatDtype(record.dtype)}
                </TableCell>
                <TableCell>
                  <span
                    className={`text-sm font-semibold ${
                      record.verificationStatus === "Pending"
                        ? "text-yellow-500"
                        : record.verificationStatus === "Approved"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
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
                        className="p-1 text-green-600 hover:text-green-800"
                        onClick={() => onResubmit(record)}
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
              <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                No records found
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
            <h4 className="text-sm font-medium text-blue-800 mb-2">PROOF DOCUMENT</h4>
            <button
              onClick={() => handleDownload(selectedRecord.id)}
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

const RecordHistory = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const { toast } = useToast();
  const { id } = useParams();

  useEffect(() => {
    fetchRecords();
  }, [id]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredRecords(records);
    } else {
      const filtered = records.filter(record => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          (record.title?.toLowerCase() || '').includes(searchTermLower) ||
          (record.description?.toLowerCase() || '').includes(searchTermLower) ||
          (record.category?.toLowerCase() || '').includes(searchTermLower) ||
          (record.comments?.toLowerCase() || '').includes(searchTermLower)
        );
      });
      setFilteredRecords(filtered);
    }
  }, [searchTerm, records]);

  const fetchRecords = async () => {
    try {
      // Fetch both pending and rejected records
      const [pendingResponse, rejectedResponse] = await Promise.all([
        axios.get(`http://localhost:8080/api/main/student/${id}/pending`, { withCredentials: true }),
        axios.get(`http://localhost:8080/api/main/student/${id}/rejected`, { withCredentials: true })
      ]);

      console.log(pendingResponse);


      const combinedRecords = [
        ...pendingResponse.data,
        ...rejectedResponse.data
      ].sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate));

      setRecords(combinedRecords);
      setFilteredRecords(combinedRecords);
    } catch (error) {
      console.error("Failed to fetch records", error);
      toast({
        title: "Error",
        description: "Failed to load records",
        variant: "destructive",
      });
    }
  };

  const handleResubmit = (record) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      setShowForm(false);
      await fetchRecords();
      toast({
        title: "Success",
        description: "Record resubmitted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resubmit record",
        variant: "destructive",
      });
    }
  };

  return (
    <PageTemplate title="Record History">
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <RecordHistoryTable 
        records={filteredRecords} 
        onResubmit={handleResubmit}
      />

      {showForm && (
        <TechnicalEventsForm
          event={editingRecord}
          onClose={() => {
            setShowForm(false);
            setEditingRecord(null);
          }}
          onSave={handleSave}
          refreshTable={fetchRecords}
        />
      )}
    </PageTemplate>
  );
};

export default RecordHistory;