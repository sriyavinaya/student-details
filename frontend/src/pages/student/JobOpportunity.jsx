import React, { useState, useEffect } from "react";
import PageTemplate from "@/components/student/StudentPageTemplate";
import JobOpportunitiesTable from "@/components/student/tables/JobOpportunitiesTable";
import JobOpportunitiesForm from "@/components/student/forms/JobOpportunitiesForm";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, ChevronDown } from "lucide-react"; // Added ChevronDown import
import axios from "axios";
import { useParams } from "react-router-dom";

const JobOpportunity = () => {
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const { toast } = useToast();
  const { id } = useParams();

  useEffect(() => {
    refreshTable();
  }, [id]);

  useEffect(() => {
    let filtered = opportunities;
    
    if (typeFilter !== "ALL") {
      filtered = filtered.filter(opp => opp.type === typeFilter);
    }
    
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(opp => {
        return (
          (opp.title?.toLowerCase() || '').includes(searchTermLower) ||
          (opp.description?.toLowerCase() || '').includes(searchTermLower) ||
          (opp.startDate ? opp.startDate.toString().toLowerCase() : '').includes(searchTermLower) ||
          (opp.companyName?.toLowerCase() || '').includes(searchTermLower) ||
          (opp.role?.toLowerCase() || '').includes(searchTermLower)
        );
      });
    }
    
    setFilteredOpportunities(filtered);
  }, [searchTerm, typeFilter, opportunities]);

  const handleSave = async (newOpportunity) => {
    try {
      setShowForm(false);
      await refreshTable();
      toast({
        title: "Success",
        description: "Opportunity added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify opportunity addition",
        variant: "destructive",
      });
    }
  };

  const refreshTable = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/job-opportunity/student/object/${id}`,
        { withCredentials: true }
      );
      setOpportunities(response.data);
      setFilteredOpportunities(response.data);
      return true;
    } catch (error) {
      console.error("Failed to fetch opportunities", error);
      throw error;
    }
  };

  return (
    <PageTemplate title="Job Opportunities">
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div className="relative">
            <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none border rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="ALL">All Types</option>
                <option value="INTERNSHIP">Internships</option>
                <option value="PLACEMENT">Placements</option>
                </select>
              <div className="absolute right-2 top-2.5 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-2 bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors w-full md:w-auto whitespace-nowrap"
            >
              <Plus size={16} />
              Add Record
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <JobOpportunitiesForm 
          onClose={() => setShowForm(false)}
          onSave={handleSave}
          refreshTable={refreshTable}
        />
      )}
      
      <JobOpportunitiesTable 
        opportunities={filteredOpportunities}
      />
    </PageTemplate>
  );
};

export default JobOpportunity;