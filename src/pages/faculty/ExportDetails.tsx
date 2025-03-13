
import { useState } from "react";
import DashboardHeader from "@/components/student/StudentDashboardHeader";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  const [exportFormat, setExportFormat] = useState<string>("csv");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedFields, setSelectedFields] = useState<string[]>([
    "name",
    "rollNumber",
    "department",
  ]);
  const [exportType, setExportType] = useState<string>("students");
  
  const { toast } = useToast();
  
  const handleFieldToggle = (field: string) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field) 
        : [...prev, field]
    );
  };
  
  const handleExport = () => {
    // In a real implementation, this would connect to a backend API
    
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
  
  const handleExportItem = (name: string) => {
    toast({
      title: "Export Started",
      description: `Exporting details for ${name}`,
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `${name} details have been exported successfully`,
      });
    }, 1500);
  };
  
  const fields = [
    { id: "name", label: "Name" },
    { id: "rollNumber", label: "Roll Number" },
    { id: "department", label: "Department" },
    { id: "email", label: "Email" },
    { id: "phone", label: "Phone" },
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
  
  // Sample export history data for faculty
  const exportHistory = [
    { id: "1", name: "John Doe", type: "Student", date: "2023-05-10" },
    { id: "2", name: "Technical Events Report", type: "Report", date: "2023-06-15" },
    { id: "3", name: "Class CS-101", type: "Class", date: "2023-07-20" },
  ];
  
  return (
    <div>
      <DashboardHeader title="Export Student Details" />
      
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="w-full md:w-1/2">
              <h2 className="text-lg font-medium mb-4">Export Type</h2>
              <Select 
                value={exportType} 
                onValueChange={setExportType}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select export type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="students">All Student Records</SelectItem>
                  <SelectItem value="technical">Technical Events</SelectItem>
                  <SelectItem value="cultural">Cultural Events</SelectItem>
                  <SelectItem value="sports">Sports Events</SelectItem>
                  <SelectItem value="achievements">Student Achievements</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-lg font-medium mb-4">Export Format</h2>
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
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
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
            
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Students
              </label>
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">Fields to Export</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">Export History</h2>
            {exportHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exportHistory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleExportItem(item.name)}
                            className="flex items-center space-x-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-1 px-3 rounded text-sm"
                          >
                            <Download size={14} />
                            <span>Export</span>
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No export history available</p>
              </div>
            )}
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
    </div>
  );
};

export default ExportDetails;
