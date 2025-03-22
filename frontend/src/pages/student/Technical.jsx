import React, { useState } from "react";
import PageTemplate from "@/components/student/StudentPageTemplate";
import TechnicalEventsTable from "@/components/student/TechnicalEventsTable";
import TechnicalEventForm from "@/components/student/TechnicalEventForm";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Technical = () => {
  const [editingEvent, setEditingEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [events, setEvents] = useState([]);
  const { toast } = useToast();

  const navigate = useNavigate();

  // Function to refresh the table data
  const refreshTable = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/technical/all", {
        withCredentials: true,
      });
      setEvents(response.data); // ✅ Update state with new events
    } catch (error) {
      console.error("Failed to fetch events", error);
    }
  };
  
  const handleSave = (updatedEvent) => {
    // In a real app, this would update the backend
    toast({
      title: "Event updated",
      description: "The event details have been updated successfully",
    });
    setEditingEvent(null);
    setShowForm(false);
    refreshTable(); // Refresh the table after saving
  };

  const handleClose = () => {
    setEditingEvent(null);
    setShowForm(false);
  };

  const handleAddNew = () => {
    setShowForm(true);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <PageTemplate title="Technical">
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
            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
              >
                <option value="">All Categories</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Workshop">Workshop</option>
                <option value="Competitions">Competitions</option>
                <option value="Technical fest - Tathva">Technical fest - Tathva</option>
                <option value="Technical fest of other colleges">Technical fest of other colleges</option>
                <option value="Other">Other</option>
              </select>
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Add Record
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <TechnicalEventForm 
          event={editingEvent || undefined} 
          onClose={handleClose}
          onSave={handleSave}
          refreshTable={refreshTable} // Pass the refresh function
        />
      )}
      <TechnicalEventsTable 
        searchTerm={searchTerm}
        filterCategory={filterCategory}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
    </PageTemplate>
  );
};

export default Technical;









