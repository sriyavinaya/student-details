import { useState } from "react";
import DashboardHeader from "@/components/student/StudentDashboardHeader";
import { Button } from "@/components/ui/button";
import { Flag, Filter, Search} from "lucide-react";

const FlagRecords = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Sample data - replace with your actual data
  const flagRecords = [
    { id: 1, studentName: "John Doe", reason: "Inappropriate content", status: "Pending", date: "2023-05-15" },
    { id: 2, studentName: "Jane Smith", reason: "Plagiarism", status: "Resolved", date: "2023-05-10" },
    { id: 3, studentName: "Alex Johnson", reason: "Late submission", status: "Pending", date: "2023-05-05" },
  ];

  // Filter records based on search and status
  const filteredRecords = flagRecords.filter(record => {
    const matchesSearch = 
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? record.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    // Implement export functionality here
    console.log("Exporting flagged records...");
  };

  return (
    <div className="container mx-auto p-4">
      <DashboardHeader title="Flag Records" />
      
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search flagged records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
            </select>
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>

          <Button onClick={handleExport} className="gap-2">
            <Flag size={16} />
            Export
          </Button>
        </div>
      </div>

      {/* Flagged Records Display */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredRecords.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredRecords.map(record => (
              <div key={record.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Flag className="text-red-500" size={18} />
                    <div>
                      <h4 className="font-medium">{record.studentName}</h4>
                      <p className="text-sm text-gray-600">{record.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      record.status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                    }`}>
                      {record.status}
                    </span>
                    <span className="text-sm text-gray-500">{record.date}</span>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Flag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No flagged records found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlagRecords;