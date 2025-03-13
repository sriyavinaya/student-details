
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";

export interface TechnicalEvent {
  id: string;
  name: string;
  date: string;
  host: string;
  category: string;
  achievement: string;
  status: string;
}

const dummyEvents: TechnicalEvent[] = [
  {
    id: '1',
    name: 'CodeFest 2023',
    date: '12/05/2023',
    host: 'Tech University',
    category: 'Hackathon',
    achievement: 'First Place',
    status: 'Completed'
  },
  {
    id: '2',
    name: 'Web Development Workshop',
    date: '23/06/2023',
    host: 'Computer Science Dept',
    category: 'Workshop',
    status: 'Completed',
    achievement: 'Participation'
  },
  {
    id: '3',
    name: 'AI Challenge',
    date: '10/08/2023',
    host: 'DataScience Institute',
    category: 'Competitions',
    status: 'Completed',
    achievement: 'Second Place'
  },
];

interface TechnicalEventsTableProps {
  searchTerm?: string;
  filterCategory?: string;
  sortField?: keyof TechnicalEvent | "";
  sortDirection?: "asc" | "desc";
  onSort?: (field: keyof TechnicalEvent) => void;
}

const TechnicalEventsTable = ({ 
  searchTerm = "", 
  filterCategory = "",
  sortField = "",
  sortDirection = "asc",
  onSort
}: TechnicalEventsTableProps) => {
  // Filter events based on search term and category
  const filteredEvents = dummyEvents.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.host.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? event.category === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  // Sort events based on sort field and direction
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSortClick = (field: keyof TechnicalEvent) => {
    if (onSort) {
      onSort(field);
    }
  };

  const SortableHeader = ({ field, label }: { field: keyof TechnicalEvent, label: string }) => (
    <TableHead 
      className="font-medium cursor-pointer"
      onClick={() => handleSortClick(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown size={14} className="opacity-50" />
      </div>
    </TableHead>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <SortableHeader field="name" label="Event Name" />
            <SortableHeader field="date" label="Date" />
            <SortableHeader field="host" label="Host" />
            <SortableHeader field="category" label="Category" />
            <SortableHeader field="achievement" label="Achievement" />
            <SortableHeader field="status" label="Status" />
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
                <TableCell>{event.achievement}</TableCell>
                <TableCell>{event.status}</TableCell>
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
