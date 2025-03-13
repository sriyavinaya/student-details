
import { useState } from "react";
import DashboardHeader from "@/components/student/StudentDashboardHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, Filter, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FlaggedRecord {
  id: string;
  studentName: string;
  rollNumber: string;
  recordType: "Technical" | "Cultural" | "Sports" | "Clubs" | "Publication";
  flaggedDate: string;
  facultyComment: string;
  eventName?: string;
  eventDate?: string;
  achievementDetails?: string;
}

const dummyFlaggedRecords: FlaggedRecord[] = [
  {
    id: "1",
    studentName: "John Doe",
    rollNumber: "B12345",
    recordType: "Technical",
    flaggedDate: "15/05/2023",
    facultyComment: "Duplicate entry. Student has submitted the same achievement twice.",
    eventName: "IEEE Code Hackathon 2023",
    eventDate: "10/05/2023",
    achievementDetails: "First place in web development category"
  },
  {
    id: "2",
    studentName: "Jane Smith",
    rollNumber: "B12346",
    recordType: "Cultural",
    flaggedDate: "16/05/2023",
    facultyComment: "Incorrect documentation. Certificate does not match the event described.",
    eventName: "Annual College Cultural Fest",
    eventDate: "05/05/2023",
    achievementDetails: "Best Vocalist Award"
  },
  {
    id: "3",
    studentName: "Bob Johnson",
    rollNumber: "B12347",
    recordType: "Sports",
    flaggedDate: "17/05/2023",
    facultyComment: "Event date is in the future. Cannot verify achievement.",
    eventName: "Inter-college Basketball Tournament",
    eventDate: "01/06/2024",
    achievementDetails: "Runner-up"
  },
  {
    id: "4",
    studentName: "Alice Williams",
    rollNumber: "B12348",
    recordType: "Clubs",
    flaggedDate: "18/05/2023",
    facultyComment: "Certificate appears to be edited or fabricated.",
    eventName: "Robotics Club Project Showcase",
    eventDate: "12/05/2023",
    achievementDetails: "Best Innovation Award"
  },
  {
    id: "5",
    studentName: "Charlie Brown",
    rollNumber: "B12349",
    recordType: "Publication",
    flaggedDate: "19/05/2023",
    facultyComment: "Publication not in the approved journal list.",
    eventName: "International Journal of Computer Science",
    eventDate: "15/05/2023",
    achievementDetails: "Research paper on AI algorithms"
  }
];

const FlaggedRecords = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [records, setRecords] = useState<FlaggedRecord[]>(dummyFlaggedRecords);
  const [selectedRecord, setSelectedRecord] = useState<FlaggedRecord | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { toast } = useToast();
  
  const handleDelete = (id: string) => {
    setRecords(prevRecords => prevRecords.filter(record => record.id !== id));
    toast({
      title: "Record Deleted",
      description: `Record with ID ${id} has been permanently deleted.`,
    });
    setShowDetailsModal(false);
  };
  
  const handleRestore = (id: string) => {
    setRecords(prevRecords => prevRecords.filter(record => record.id !== id));
    toast({
      title: "Record Restored",
      description: `Record with ID ${id} has been restored and removed from flagged list.`,
    });
    setShowDetailsModal(false);
  };

  const viewRecordDetails = (record: FlaggedRecord) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  // Filter records based on search term and type
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          record.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter ? record.recordType === typeFilter : true;
    return matchesSearch && matchesType;
  });

  const recordTypes = Array.from(new Set(records.map(r => r.recordType)));

  const getRecordTypeColor = (type: string) => {
    switch(type) {
      case "Technical": return "bg-blue-100 text-blue-800";
      case "Cultural": return "bg-purple-100 text-purple-800";
      case "Sports": return "bg-green-100 text-green-800";
      case "Clubs": return "bg-yellow-100 text-yellow-800";
      case "Publication": return "bg-indigo-100 text-indigo-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <DashboardHeader title="Flagged Records" />
      
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
            >
              <option value="">All Record Types</option>
              {recordTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="font-medium">Student Name</TableHead>
              <TableHead className="font-medium">Roll Number</TableHead>
              <TableHead className="font-medium">Record Type</TableHead>
              <TableHead className="font-medium">Flagged Date</TableHead>
              <TableHead className="font-medium">Faculty Comment</TableHead>
              <TableHead className="font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.studentName}</TableCell>
                  <TableCell>{record.rollNumber}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRecordTypeColor(record.recordType)}`}>
                      {record.recordType}
                    </span>
                  </TableCell>
                  <TableCell>{record.flaggedDate}</TableCell>
                  <TableCell className="max-w-xs truncate" title={record.facultyComment}>
                    {record.facultyComment}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewRecordDetails(record)}
                        className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                  No flagged records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Details Modal */}
      {showDetailsModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium">
                Flagged Record Details
              </h3>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-100 p-4 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">STUDENT NAME</h4>
                  <p className="font-medium">{selectedRecord.studentName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">ROLL NUMBER</h4>
                  <p className="font-medium">{selectedRecord.rollNumber}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">RECORD TYPE</h4>
                  <p className="font-medium">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRecordTypeColor(selectedRecord.recordType)}`}>
                      {selectedRecord.recordType}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">EVENT NAME</h4>
                  <p>{selectedRecord.eventName}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">EVENT DATE</h4>
                    <p>{selectedRecord.eventDate}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">FLAGGED DATE</h4>
                    <p>{selectedRecord.flaggedDate}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">ACHIEVEMENT DETAILS</h4>
                  <p>{selectedRecord.achievementDetails}</p>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border border-red-200 bg-red-50">
                <h4 className="text-sm font-medium text-red-800 mb-2">FACULTY COMMENT</h4>
                <p className="text-red-700">{selectedRecord.facultyComment}</p>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleDelete(selectedRecord.id)}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md"
                >
                  Delete Permanently
                </button>
                <button
                  onClick={() => handleRestore(selectedRecord.id)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                >
                  Restore Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlaggedRecords;
