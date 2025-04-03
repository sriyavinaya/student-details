import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, Eye, Download, X } from "lucide-react";
import axios from "axios";

const ITEMS_PER_PAGE = 10;

const TechnicalEventsTable = ({ events = [] }) => {  // Added default empty array
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);

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

  // Sorting logic
  const sortedEvents = [...events].sort((a, b) => {
    if (!sortField) return 0;

    const valueA = a[sortField] || "";
    const valueB = b[sortField] || "";

    if (sortField === "eventDate") {
      return sortDirection === "asc" ? new Date(valueA) - new Date(valueB) : new Date(valueB) - new Date(valueA);
    }

    if (typeof valueA === "string") {
      return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    } else {
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    }
  });

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(sortedEvents.length / ITEMS_PER_PAGE));
  const paginatedEvents = sortedEvents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            {[
              { label: "Event Name", field: "title" },
              { label: "Date", field: "eventDate" },
              { label: "Host", field: "host" },
              { label: "Category", field: "category" },
              { label: "Achievement", field: "achievement" },
              { label: "Status", field: "verificationStatus" }
            ].map(({ label, field }) => (
              <TableHead key={field} className="cursor-pointer" onClick={() => handleSortClick(field)}>
                <div className="flex items-center gap-1">
                  {label} <ArrowUpDown size={14} className="opacity-50" />
                </div>
              </TableHead>
            ))}
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedEvents.length > 0 ? (
            paginatedEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.title}</TableCell>
                <TableCell>{formatDate(event.eventDate)}</TableCell>
                <TableCell>{event.host}</TableCell>
                <TableCell>{event.category}</TableCell>
                <TableCell>{event.achievement || "N/A"}</TableCell>
                <TableCell>
                  <span
                    className={`text-sm font-semibold ${
                      event.verificationStatus === "Pending"
                        ? "text-yellow-500"
                        : event.verificationStatus === "Approved"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {event.verificationStatus}
                  </span>
                </TableCell>
                <TableCell>
                  <button
                    className="px-2 py-1 bg-blue-100 font-medium text-blue-600 rounded hover:bg-blue-400 text-sm flex items-center gap-1"
                    onClick={() => setSelectedEvent(event)}
                  >
                    VIEW
                  </button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                No events found
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

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium text-gray-800">Event Verification Details</h3>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-6">
            <div className="space-y-6">
  {/* Event Information Section */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-100 p-4 rounded-lg">
    <div>
      <h4 className="text-sm font-medium text-gray-500">EVENT TITLE</h4>
      <p className="font-medium text-gray-900">{selectedEvent.title}</p>
    </div>
    <div>
      <h4 className="text-sm font-medium text-gray-500">CATEGORY</h4>
      <p className="font-medium text-gray-900">{selectedEvent.category}</p>
    </div>
    <div>
      <h4 className="text-sm font-medium text-gray-500">STATUS</h4>
      <p className={`font-medium ${
        selectedEvent.verificationStatus === "Pending" ? "text-yellow-600" :
        selectedEvent.verificationStatus === "Approved" ? "text-green-600" :
        "text-red-600"
      }`}>
        {selectedEvent.verificationStatus}
      </p>
    </div>
  </div>

  {/* Event Details Section */}
  <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h4 className="text-sm font-medium text-gray-500">EVENT DATE</h4>
        <p className="font-medium text-gray-900">{formatDate(selectedEvent.eventDate)}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-500">HOST</h4>
        <p className="font-medium text-gray-900">{selectedEvent.host}</p>
      </div>
    </div>
    
    <div>
      <h4 className="text-sm font-medium text-gray-500">ACHIEVEMENT</h4>
      <p className="font-medium text-gray-900">{selectedEvent.achievement || "N/A"}</p>
    </div>

    <div>
      <h4 className="text-sm font-medium text-gray-500">DESCRIPTION</h4>
      <p className="font-medium text-gray-900">{selectedEvent.description || "N/A"}</p>
    </div>

    <div>
      <h4 className="text-sm font-medium text-gray-500">FACULTY COMMENTS</h4>
      <p className="font-medium text-gray-900">
        {selectedEvent.comments || "No comments available"}
      </p>
    </div>
  </div>

  {/* Document Download Section */}
  {selectedEvent.documentPath && (
    <div className="p-4 rounded-lg border border-blue-50 bg-blue-50">
      <h4 className="text-sm font-medium text-blue-800 mb-2">PROOF DOCUMENT</h4>
      <button
        onClick={() => handleDownload(selectedEvent.id)}
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
        </div>
      )}
    </div>
  );
};

export default TechnicalEventsTable;