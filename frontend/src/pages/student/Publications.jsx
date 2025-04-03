import React, { useState, useEffect } from "react";
import PageTemplate from "@/components/student/StudentPageTemplate";
import PublicationsTable from "@/components/student/tables/PublicationsTable";
import PublicationsForm from "@/components/student/forms/PublicationsForm";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search } from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Publications = () => {
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]); // Fixed variable name
  const { toast } = useToast();
  const { id } = useParams();

  useEffect(() => {
    refreshTable();
  }, [id]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredRecords(records);
    } else {
      const filtered = records.filter(record => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          (record.title?.toLowerCase() || '').includes(searchTermLower) ||
          (record.author?.toLowerCase() || '').includes(searchTermLower) ||
          (record.doi?.toLowerCase() || '').includes(searchTermLower) ||
          (record.keywords?.toLowerCase() || '').includes(searchTermLower)
        );
      });
      setFilteredRecords(filtered);
    }
  }, [searchTerm, records]);

  const handleSave = async (newEvent) => {
    try {
      setShowForm(false);
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
        `http://localhost:8080/api/publications/student/object/${id}`,
        { withCredentials: true }
      );
      setRecords(response.data); // Changed from setEvents to setRecords
      setFilteredRecords(response.data); // Changed from setFilteredEvents
      return true;
    } catch (error) {
      console.error("Failed to fetch events", error);
      throw error;
    }
  };

  return (
    <PageTemplate title="Publications">
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search publications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Add Record
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <PublicationsForm 
          onClose={() => setShowForm(false)}
          onSave={handleSave}
          refreshTable={refreshTable}
        />
      )}
      
      <PublicationsTable 
        publications={filteredRecords}
      />
    </PageTemplate>
  );
};

export default Publications;