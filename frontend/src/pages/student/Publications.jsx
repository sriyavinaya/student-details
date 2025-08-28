import React, { useState, useEffect } from "react";
import PageTemplate from "@/components/student/StudentPageTemplate";
import PublicationsTable from "@/components/student/tables/PublicationsTable";
import FacultyPublicationsTable from "@/components/faculty/FacultyPublicationsTable";
import PublicationsForm from "@/components/student/forms/PublicationsForm";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, BookOpen } from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Publications = () => {
  const [studentPublications, setStudentPublications] = useState([]);
  const [facultyPublications, setFacultyPublications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("student"); // 'student' or 'faculty'
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch student publications
        const studentResponse = await axios.get(
          `http://localhost:8080/api/publications/student/object/${id}`,
          { withCredentials: true }
        );
        setStudentPublications(studentResponse.data);
        
        // Get faculty ID from the first student publication (if available)
        if (studentResponse.data.length > 0 && studentResponse.data[0].faculty) {
          const facultyId = studentResponse.data[0].faculty.id;
          // Fetch faculty publications (read-only for students)
          const facultyResponse = await axios.get(
            `http://localhost:8080/api/faculty-publications/faculty/${facultyId}`,
            { withCredentials: true }
          );
          setFacultyPublications(facultyResponse.data);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch publications",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, toast]);

  const handleSave = async (newPublication) => {
    try {
      setShowForm(false);
      // Refresh student publications after saving
      const response = await axios.get(
        `http://localhost:8080/api/publications/student/object/${id}`,
        { withCredentials: true }
      );
      setStudentPublications(response.data);
      
      toast({
        title: "Success",
        description: "Publication added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add publication",
        variant: "destructive",
      });
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
              placeholder={`Search ${viewMode} publications...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode(viewMode === "student" ? "faculty" : "student")}
              className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              <BookOpen size={16} />
              {viewMode === "student" ? "View Faculty Publications" : "View My Publications"}
            </button>
            
            {viewMode === "student" && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} />
                Add Publication
              </button>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <PublicationsForm 
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading publications...</p>
        </div>
      ) : viewMode === "student" ? (
        <PublicationsTable 
          publications={studentPublications.filter(pub => {
            if (!searchTerm) return true;
            const term = searchTerm.toLowerCase();
            return (
              (pub.title?.toLowerCase() || '').includes(term) ||
              (pub.author?.toLowerCase() || '').includes(term) ||
              (pub.doi?.toLowerCase() || '').includes(term) ||
              (pub.keywords?.toLowerCase() || '').includes(term)
            );
          })}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <FacultyPublicationsTable 
            publications={facultyPublications.filter(pub => {
              if (!searchTerm) return true;
              const term = searchTerm.toLowerCase();
              return (
                (pub.title?.toLowerCase() || '').includes(term) ||
                (pub.author?.toLowerCase() || '').includes(term) ||
                (pub.doi?.toLowerCase() || '').includes(term) ||
                (pub.keywords?.toLowerCase() || '').includes(term)
              );
            })}
            showFacultyInfo={false}
            isReadOnly={true}  // Added prop to make table read-only
          />
          <div className="p-4 text-sm text-gray-500 border-t">
            Note: Faculty publications are view-only for students.
          </div>
        </div>
      )}
    </PageTemplate>
  );
};

export default Publications;



// import React, { useState, useEffect } from "react";
// import PageTemplate from "@/components/student/StudentPageTemplate";
// import PublicationsTable from "@/components/student/tables/PublicationsTable";
// import PublicationsForm from "@/components/student/forms/PublicationsForm";
// import { useToast } from "@/hooks/use-toast";
// import { Plus, Search } from "lucide-react";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// const Publications = () => {
//   const [records, setRecords] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredRecords, setFilteredRecords] = useState([]); // Fixed variable name
//   const { toast } = useToast();
//   const { id } = useParams();

//   useEffect(() => {
//     refreshTable();
//   }, [id]);

//   useEffect(() => {
//     if (searchTerm === "") {
//       setFilteredRecords(records);
//     } else {
//       const filtered = records.filter(record => {
//         const searchTermLower = searchTerm.toLowerCase();
//         return (
//           (record.title?.toLowerCase() || '').includes(searchTermLower) ||
//           (record.author?.toLowerCase() || '').includes(searchTermLower) ||
//           (record.doi?.toLowerCase() || '').includes(searchTermLower) ||
//           (record.keywords?.toLowerCase() || '').includes(searchTermLower)
//         );
//       });
//       setFilteredRecords(filtered);
//     }
//   }, [searchTerm, records]);

//   const handleSave = async (newEvent) => {
//     try {
//       setShowForm(false);
//       await refreshTable();
//       toast({
//         title: "Success",
//         description: "Event added successfully",
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to verify event addition",
//         variant: "destructive",
//       });
//     }
//   };

//   const refreshTable = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/api/publications/student/object/${id}`,
//         { withCredentials: true }
//       );
//       setRecords(response.data); // Changed from setEvents to setRecords
//       setFilteredRecords(response.data); // Changed from setFilteredEvents
//       return true;
//     } catch (error) {
//       console.error("Failed to fetch events", error);
//       throw error;
//     }
//   };

//   return (
//     <PageTemplate title="Publications">
//       <div className="mb-6 space-y-4">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div className="relative w-full md:w-72">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//             <input
//               type="text"
//               placeholder="Search publications..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//           </div>
          
//           <div className="flex gap-2">
//             <button
//               onClick={() => setShowForm(true)}
//               className="flex items-center gap-2 bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
//             >
//               <Plus size={16} />
//               Add Record
//             </button>
//           </div>
//         </div>
//       </div>

//       {showForm && (
//         <PublicationsForm 
//           onClose={() => setShowForm(false)}
//           onSave={handleSave}
//           refreshTable={refreshTable}
//         />
//       )}
      
//       <PublicationsTable 
//         publications={filteredRecords}
//       />
//     </PageTemplate>
//   );
// };

// export default Publications;