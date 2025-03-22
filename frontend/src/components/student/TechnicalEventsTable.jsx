import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import axios from 'axios';

const TechnicalEventsTable = () => {
  const [events, setEvents] = useState([]);
  const [sortField, setSortField] = useState(""); 
  const [sortDirection, setSortDirection] = useState("asc"); 

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/technical/all', {
          withCredentials: true,
        });
        setEvents(response.data);
      } catch (error) {
        console.error("Failed to fetch events", error);
      }
    };
    fetchEvents();
  }, []);

  const handleSortClick = (field) => {
    if (sortField === field) {
      // Toggle sort direction if the same field is clicked again
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field and reset to ascending order
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sorting logic
  const sortedEvents = [...events].sort((a, b) => {
    if (!sortField) return 0;
    
    const valueA = a[sortField] || "";
    const valueB = b[sortField] || "";

    if (typeof valueA === "string") {
      return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    } else {
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    }
  });

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="cursor-pointer" onClick={() => handleSortClick("name")}>
              Event Name <ArrowUpDown size={14} className="opacity-50" />
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSortClick("date")}>
              Date <ArrowUpDown size={14} className="opacity-50" />
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSortClick("host")}>
              Host <ArrowUpDown size={14} className="opacity-50" />
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSortClick("category")}>
              Category <ArrowUpDown size={14} className="opacity-50" />
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSortClick("achievement")}>
              Achievement <ArrowUpDown size={14} className="opacity-50" />
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSortClick("status")}>
              Status <ArrowUpDown size={14} className="opacity-50" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEvents.length > 0 ? (
            sortedEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.name}</TableCell>
                <TableCell>{event.date}</TableCell>
                <TableCell>{event.host}</TableCell>
                <TableCell>{event.category}</TableCell>
                <TableCell>{event.achievement || "N/A"}</TableCell>
                <TableCell>
                <span
                  className={`text-sm font-semibold ${
                    event.status === "Pending"
                      ? "text-yellow-500" // Dark yellow text
                      : event.status === "Approved"
                      ? "text-green-600" // Green text
                      : "text-red-600" // Red text
                  }`}
                >
                  {event.status}
                </span>
              </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                No events found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TechnicalEventsTable;



// <TableCell>
//                   <span
//                     className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
//                       event.status === "Pending"
//                         ? "bg-yellow-500 text-white"
//                         : event.status === "Approved"
//                         ? "bg-green-500 text-white"
//                         : "bg-red-500 text-white"
//                     }`}
//                   >
//                     {event.status}
//                   </span>
//                 </TableCell>