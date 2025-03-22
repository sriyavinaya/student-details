import { useState } from "react";
import DashboardHeader from "@/components/student/StudentDashboardHeader";
import { Button } from "@/components/ui/button";
import { FileDown, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const Export = () => {
  const [exportFormat, setExportFormat] = useState("csv");
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
    toast({
      title: "Export Started",
      description: `Exporting your personal details in ${exportFormat.toUpperCase()} format`,
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Your records have been exported successfully",
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
  
  return (
    <div>
      <DashboardHeader title="Export Records" />
      
      <div className="mb-6 grid gap-6">
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
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">Fields to Export</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
            Export Records
          </Button>
        </div>
      </div>
      
      {/* <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium mb-4">Export Export</h2>
        <div className="text-center py-8 text-gray-500">
          <p>You haven't exported any records yet.</p>
        </div>
      </div> */}
    </div>
  );
};

export default Export;