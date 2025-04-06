import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search , X} from 'lucide-react';
import PageTemplate from "@/components/student/StudentPageTemplate";
import FacultyPublicationsTable from '@/components/faculty/FacultyPublicationsTable';
import FacultyPublicationsForm from '@/components/faculty/FacultyPublicationsForm';
import { useParams } from 'react-router-dom';

const FacultyPublicationsPage = () => {
  const { toast } = useToast();
  const [publications, setPublications] = useState([]);
  const [filteredPublications, setFilteredPublications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();


  // Fetch publications on component mount
  useEffect(() => {
    fetchPublications();
  }, [id]);

  // Filter publications based on search term
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredPublications(publications);
    } else {
      const filtered = publications.filter(pub => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          (pub.title?.toLowerCase() || '').includes(searchTermLower) ||
          (pub.author?.toLowerCase() || '').includes(searchTermLower) ||
          (pub.doi?.toLowerCase() || '').includes(searchTermLower) ||
          (pub.keywords?.toLowerCase() || '').includes(searchTermLower)
        );
      });
      setFilteredPublications(filtered);
    }
  }, [searchTerm, publications]);

  const fetchPublications = async () => {
    // console.log(id);
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/faculty-publications/faculty/${id}`,
        { withCredentials: true }
      );
      setPublications(response.data);
      setFilteredPublications(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch faculty publications',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('facultyId', formData.facultyId);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('publicationType', formData.publicationType);
      formDataToSend.append('orcidId', formData.orcidId || '');
      formDataToSend.append('author', formData.author);
      formDataToSend.append('year', formData.year);
      formDataToSend.append('collaborators', formData.collaborators || '');
      formDataToSend.append('doi', formData.doi || '');
      formDataToSend.append('keywords', formData.keywords || '');
      formDataToSend.append('abstractContent', formData.abstractContent);
      formDataToSend.append('description', formData.description);
      
      if (formData.documentPath) {
        formDataToSend.append('documentPath', formData.documentPath);
      }

      await axios.post(
        'http://localhost:8080/api/faculty-publications/submit',
        formDataToSend,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      toast({
        title: 'Success',
        description: 'Faculty publication submitted successfully',
      });
      
      setShowForm(false);
      await fetchPublications();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to submit publication',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePublication = async (publicationId) => {
    try {
      // This updates the local state to remove the deleted publication
      setPublications(prev => prev.filter(pub => pub.id !== publicationId));
    } catch (error) {
      console.error("Error handling delete:", error);
      throw error; // This will be caught by the table component's handleDelete
    }
  };

  return (
    <PageTemplate title="Faculty Publications">
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search faculty publications..."
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
              Add Publication
            </button>
          </div>
        </div>
      </div>

        {/* Active Filters Display */}
        {(searchTerm !== "all") && (
          <div className="mb-4 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-500">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                Search: {searchTerm}
                <button 
                  onClick={() => setSearchTerm("")}
                  className="ml-1 p-0.5 rounded-full hover:bg-blue-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}

      {showForm && (
    <FacultyPublicationsForm 
        onClose={() => setShowForm(false)}
        onSave={handleSave}
        refreshTable={fetchPublications}
    />
)}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading publications...</p>
        </div>
      ) : (
        <FacultyPublicationsTable 
          publications={filteredPublications}
          onDelete={handleDeletePublication}
          showFacultyInfo={false}
        />
      )}
    </PageTemplate>
  );
};

export default FacultyPublicationsPage;