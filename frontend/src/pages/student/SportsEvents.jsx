import React, { useState, useEffect } from "react";
import PageTemplate from "@/components/student/StudentPageTemplate";
import SportsEventsTable from "@/components/student/tables/SportsEventsTable";
import SportsEventsForm from "@/components/student/forms/SportsEventsForm";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search } from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";

const SportsEvents = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const { toast } = useToast();
  const { id } = useParams();

  // Single source of data fetching - only in parent
  

  useEffect(() => {
    refreshTable();
  }, [id]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          (event.title?.toLowerCase() || '').includes(searchTermLower) ||
          (event.eventLevel?.toLowerCase() || '').includes(searchTermLower) ||
          (event.role?.toLowerCase() || '').includes(searchTermLower) ||
          (event.outcome?.toLowerCase() || '').includes(searchTermLower)
        );
      });
      setFilteredEvents(filtered);
    }
  }, [searchTerm, events]);

  const handleSave = async (newEvent) => {
    try {
      // First close the form immediately
      setShowForm(false);
      
      // Then refresh the data from server
      await refreshTable();
      
      toast({
        title: "Success",
        description: "Event added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify event addition",
        variant: "destructive",
      });
    }
  };


  const refreshTable = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/sports/student/object/${id}`,
        { withCredentials: true }
      );
      setEvents(response.data);
      setFilteredEvents(response.data);
      return true; // Indicate success
    } catch (error) {
      console.error("Failed to fetch events", error);
      throw error; // Re-throw for error handling
    }
  };

  return (
    <PageTemplate title="Sports Events">
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <button
            onClick={() => setShowForm(true)}
              // onClick={handleAddNew}
              className="flex items-center gap-2 bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Add Record
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <SportsEventsForm 
          onClose={() => setShowForm(false)}
          onSave={handleSave}
          refreshTable={refreshTable}
        />
      )}
      
      <SportsEventsTable 
        events={filteredEvents}
      />
    </PageTemplate>
  );
};

export default SportsEvents;