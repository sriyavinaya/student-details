import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";  // ✅ Correct import

const ITEMS_PER_PAGE = 10;

const CulturalEventsTable = () => {
  const [events, setEvents] = useState([]);
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const { id } = useParams(); // ✅ Correctly fetching id from URL

  useEffect(() => {
    if (!id) return; // ✅ Ensure id is available before making API call

    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/cultural/student/${id}`, {
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

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN");
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

  const paginatedEvents = sortedEvents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            {[
              { label: "Event Name", field: "eventName" },
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
            {/* Extra column for Action */}
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedEvents.length > 0 ? (
            paginatedEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.eventName}</TableCell>
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
                {/* Action column with View button */}
                <TableCell>
                  <button
                    className="px-3 py-1 bg-blue-100 font-medium text-blue-600 rounded hover:bg-blue-400 text-sm"
                    onClick={() => alert(`Viewing event: ${event.eventName}`)}
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

      {/* Pagination Controls */}
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
    </div>
  );
};

export default CulturalEventsTable;





// import React, { useEffect, useState } from "react";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { ArrowUpDown } from "lucide-react";
// import axios from "axios";

// const ITEMS_PER_PAGE = 10;

// const CulturalEventsTable = () => {
//   const [events, setEvents] = useState([]);
//   const [sortField, setSortField] = useState("");
//   const [sortDirection, setSortDirection] = useState("asc");
//   const [currentPage, setCurrentPage] = useState(1); // Track the current page

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const response = await axios.get("http://localhost:8080/api/technical/all", {
//           withCredentials: true,
//         });
//         setEvents(response.data);
//       } catch (error) {
//         console.error("Failed to fetch events", error);
//       }
//     };
//     fetchEvents();
//   }, []);

//   const handleSortClick = (field) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc");
//     } else {
//       setSortField(field);
//       setSortDirection("asc");
//     }
//   };

//   // Sorting logic
//   const sortedEvents = [...events].sort((a, b) => {
//     if (!sortField) return 0;

//     const valueA = a[sortField] || "";
//     const valueB = b[sortField] || "";

//     if (typeof valueA === "string") {
//       return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
//     } else {
//       return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
//     }
//   });

//   // Pagination logic
//   const totalPages = Math.ceil(sortedEvents.length / ITEMS_PER_PAGE);
//   const paginatedEvents = sortedEvents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

//   return (
//     <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//       <Table>
//         <TableHeader>
//           <TableRow className="bg-gray-100">
//             {["name", "date", "host", "category", "achievement", "status"].map((field) => (
//               <TableHead key={field} className="cursor-pointer" onClick={() => handleSortClick(field)}>
//                 <div className="flex items-center gap-1">
//                   {field.charAt(0).toUpperCase() + field.slice(1)} <ArrowUpDown size={14} className="opacity-50" />
//                 </div>
//               </TableHead>
//             ))}
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {paginatedEvents.length > 0 ? (
//             paginatedEvents.map((event) => (
//               <TableRow key={event.id}>
//                 <TableCell>{event.name}</TableCell>
//                 <TableCell>{event.date}</TableCell>
//                 <TableCell>{event.host}</TableCell>
//                 <TableCell>{event.category}</TableCell>
//                 <TableCell>{event.achievement || "N/A"}</TableCell>
//                 <TableCell>
//                   <span
//                     className={`text-sm font-semibold ${
//                       event.status === "Pending"
//                         ? "text-yellow-500"
//                         : event.status === "Approved"
//                         ? "text-green-600"
//                         : "text-red-600"
//                     }`}
//                   >
//                     {event.status}
//                   </span>
//                 </TableCell>
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={6} className="text-center py-4 text-gray-500">
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

// export default CulturalEventsTable;