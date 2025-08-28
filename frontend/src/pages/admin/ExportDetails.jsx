
import { useState } from "react";
import DashboardHeader from "@/components/student/StudentDashboardHeader";
import { Button } from "@/components/ui/button";
import { Download, FileDown, Filter, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const ExportDetails = () => {
  const [exportFormat, setExportFormat] = useState("csv");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedFields, setSelectedFields] = useState([
    "name",
    "rollNumber",
    "department",
  ]);
  
  const { toast } = useToast();
  
  const handleFieldToggle = (field) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field) 
        : [...prev, field]
    );
  };
  
  const handleExport = () => {
    // In a real implementation, this would connect to a backend API
    // to generate and download the file
    
    toast({
      title: "Export Started",
      description: `Exporting ${selectedFields.length} fields in ${exportFormat.toUpperCase()} format`,
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Student details have been exported successfully",
      });
    }, 1500);
  };
  
  const fields = [
    { id: "name", label: "Name" },
    { id: "rollNumber", label: "Roll Number" },
    { id: "department", label: "Department" },
    { id: "email", label: "Email" },
    { id: "phone", label: "Phone" },
    { id: "address", label: "Address" },
    { id: "technical", label: "Technical Events" },
    { id: "cultural", label: "Cultural Events" },
    { id: "sports", label: "Sports Events" },
    { id: "clubs", label: "Club Activities" },
    { id: "internships", label: "Internships" },
    { id: "publications", label: "Publications" },
  ];
  
  const departments = [
    "All Departments",
    "Computer Science",
    "Information Technology",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
  ];
  
  return (
    <div>
      <DashboardHeader title="Export Student Details" />
      
      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">Export Options</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Export Format
              </label>
              <Select 
                value={exportFormat} 
                onValueChange={setExportFormat}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department Filter
              </label>
              <Select 
                value={selectedDepartment} 
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">Fields to Export</h2>
          <div className="grid grid-cols-2 gap-3">
            {fields.map((field) => (
              <div key={field.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={field.id}
                  checked={selectedFields.includes(field.id)}
                  onCheckedChange={() => handleFieldToggle(field.id)}
                />
                <label
                  htmlFor={field.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {field.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Selected {selectedFields.length} out of {fields.length} fields
          </p>
          <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700">
            <FileDown className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium mb-4">Export History</h2>
        <div className="text-center py-8 text-gray-500">
          <Download className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p>No recent exports</p>
        </div>
      </div>
    </div>
  );
};

export default ExportDetails;
