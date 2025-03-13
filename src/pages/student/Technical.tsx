
import React, { useState } from "react";
import PageTemplate from "@/components/student/StudentPageTemplate";
import TechnicalEventsTable, { TechnicalEvent } from "@/components/student/TechnicalEventsTable";
import TechnicalEventForm from "@/components/student/TechnicalEventForm";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Filter } from "lucide-react";

const Technical = () => {
  const [editingEvent, setEditingEvent] = useState<TechnicalEvent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortField, setSortField] = useState<keyof TechnicalEvent | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();

  const handleSave = (updatedEvent: Partial<TechnicalEvent>) => {
    // In a real app, this would update the backend
    toast({
      title: "Event updated",
      description: "The event details have been updated successfully",
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  const handleClose = () => {
    setEditingEvent(null);
    setShowForm(false);
  };

  const handleAddNew = () => {
    setEditingEvent(null);
    setShowForm(true);
  };

  const handleSort = (field: keyof TechnicalEvent) => {
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
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
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
