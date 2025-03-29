import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, Eye, Download } from "lucide-react"; // ✅ Minimal icons
import axios from "axios";
import { useParams } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

const TechnicalEventsTable = () => {
  const [events, setEvents] = useState([]);
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/technical/student/${id}`, {
          withCredentials: true,
        });
        setEvents(response.data);
      } catch (error) {
        console.error("Failed to fetch events", error);
      }
    };
    fetchEvents();
  }, [id]);

  const handleSortClick = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN");
  };

  const handleDownload = async (eventId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/technical/download/${eventId}`, {
        responseType: "blob", // Ensures we get a binary file
        withCredentials: true, // Ensures session credentials are included
      });
  
      // ✅ Create a Blob URL for the downloaded file
      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const url = window.URL.createObjectURL(blob);
  
      // ✅ Create a temporary download link
      const link = document.createElement("a");
      link.href = url;
      link.download = `document_${eventId}`; // Change filename if needed
      document.body.appendChild(link);
      link.click();
      
      // ✅ Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download file");
    }
  };
  

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

  const totalPages = Math.max(1, Math.ceil(sortedEvents.length / ITEMS_PER_PAGE));

  const paginatedEvents = sortedEvents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
          className="px-4 py-2 bg-gray-200 text-gray-600 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 text-gray-600 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {selectedEvent && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full h-auto">
      <h2 className="text-xl font-semibold mb-4">{selectedEvent.title}</h2>
      <p className="text-sm"><strong>Date:</strong> {formatDate(selectedEvent.eventDate)}</p>
      <p className="text-sm"><strong>Host:</strong> {selectedEvent.host}</p>
      <p className="text-sm"><strong>Category:</strong> {selectedEvent.category}</p>
      <p className="text-sm"><strong>Achievement:</strong> {selectedEvent.achievement || "N/A"}</p>
      <p className="text-sm"><strong>Description:</strong> {selectedEvent.description || "N/A"}</p>
      <p className="text-sm"><strong>Comments:</strong> {selectedEvent.comments || "No comments"}</p>
      <p className="text-sm"><strong>Status:</strong> {selectedEvent.verificationStatus}</p>

      {selectedEvent?.documentPath && (
  <button
    className="mt-3 px-3 py-2 border border-gray-400 text-gray-700 rounded flex items-center gap-2 text-sm"
    onClick={() => handleDownload(selectedEvent.id)}
  >
    <Download size={16} /> Download File
  </button>
)}


      <button
        className="mt-4 px-4 py-2 bg-gray-200 text-gray-600 rounded w-full"
        onClick={() => setSelectedEvent(null)}
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default TechnicalEventsTable;







// import React, { useEffect, useState } from "react";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { ArrowUpDown } from "lucide-react";
// import axios from "axios";
// import { useParams } from "react-router-dom";  // ✅ Correct import

// const ITEMS_PER_PAGE = 10;

// const TechnicalEventsTable = () => {
//   const [events, setEvents] = useState([]);
//   const [sortField, setSortField] = useState("");
//   const [sortDirection, setSortDirection] = useState("asc");
//   const [currentPage, setCurrentPage] = useState(1);

//   const { id } = useParams(); // ✅ Correctly fetching id from URL
//   // console.log("Student ID from URL:", id);

//   useEffect(() => {
//     if (!id) return; // ✅ Ensure id is available before making API call

//     const fetchEvents = async () => {
//       try {
//         // console.log(id);
//         const response = await axios.get(`http://localhost:8080/api/technical/student/${id}`, {
//           withCredentials: true,
//         });
//         setEvents(response.data);
//         // console.log("Fetched Events:", response.data); 
//       } catch (error) {
//         console.error("Failed to fetch events", error);
//       }
//     };
//     fetchEvents();
//   }, [id]);

//   const handleSortClick = (field) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc");
//     } else {
//       setSortField(field);
//       setSortDirection("asc");
//     }
//   };

//   // Function to format date
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-IN");
//   };

//   // Sorting logic
//   const sortedEvents = [...events].sort((a, b) => {
//     if (!sortField) return 0;

//     const valueA = a[sortField] || "";
//     const valueB = b[sortField] || "";

//     if (sortField === "eventDate") {
//       return sortDirection === "asc" ? new Date(valueA) - new Date(valueB) : new Date(valueB) - new Date(valueA);
//     }

//     if (typeof valueA === "string") {
//       return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
//     } else {
//       return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
//     }
//   });

//   // Pagination logic
//   const totalPages = Math.max(1, Math.ceil(sortedEvents.length / ITEMS_PER_PAGE));

//   const paginatedEvents = sortedEvents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

//   return (
//     <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//       <Table>
//         <TableHeader>
//           <TableRow className="bg-gray-100">
//             {[
//               { label: "Event Name", field: "title" },
//               { label: "Date", field: "eventDate" },
//               { label: "Host", field: "host" },
//               { label: "Category", field: "category" },
//               { label: "Achievement", field: "achievement" },
//               { label: "Status", field: "verificationStatus" }
//             ].map(({ label, field }) => (
//               <TableHead key={field} className="cursor-pointer" onClick={() => handleSortClick(field)}>
//                 <div className="flex items-center gap-1">
//                   {label} <ArrowUpDown size={14} className="opacity-50" />
//                 </div>
//               </TableHead>
//             ))}
//             {/* Extra column for Action */}
//             <TableHead>Action</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {paginatedEvents.length > 0 ? (
//             paginatedEvents.map((event) => (
//               <TableRow key={event.id}>
//                 <TableCell>{event.title}</TableCell>
//                 <TableCell>{formatDate(event.eventDate)}</TableCell>
//                 <TableCell>{event.host}</TableCell>
//                 <TableCell>{event.category}</TableCell>
//                 <TableCell>{event.achievement || "N/A"}</TableCell>
//                 <TableCell>
//                   <span
//                     className={`text-sm font-semibold ${
//                       event.verificationStatus === "Pending"
//                         ? "text-yellow-500"
//                         : event.verificationStatus === "Approved"
//                         ? "text-green-600"
//                         : "text-red-600"
//                     }`}
//                   >
//                     {event.verificationStatus}
//                   </span>
//                 </TableCell>
//                 {/* Action column with View button */}
//                 <TableCell>
//                   <button
//                     className="px-3 py-1 bg-blue-100 font-medium text-blue-600 rounded hover:bg-blue-400 text-sm"
//                     onClick={() => alert(`Viewing event: ${event.title}`)}
//                   >
//                     VIEW
//                   </button>
//                 </TableCell>
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={7} className="text-center py-4 text-gray-500">
//                 No events found
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>

//       {/* Pagination Controls */}
//       <div className="flex justify-between items-center p-4">
//         <button
//           onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//           disabled={currentPage === 1}
//           className="px-4 py-2 bg-gray-200 text-gray-600 rounded disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span className="text-gray-600">
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//           disabled={currentPage === totalPages}
//           className="px-4 py-2 bg-gray-200 text-gray-600 rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TechnicalEventsTable;






