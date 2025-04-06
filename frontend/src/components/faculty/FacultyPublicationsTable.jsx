import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, Download, X, Trash2 } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 10;

const FacultyPublicationsTable = ({ publications = [], onDelete, isFaculty = false }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSortClick = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDownload = async (publicationId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/main/download/${publicationId}`, {
        responseType: "blob",
        withCredentials: true,
      });
  
      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `publication_${publicationId}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (publicationId) => {
    try {
      setIsDeleting(true);
      const response = await axios.delete(
        `http://localhost:8080/api/faculty-publications/delete/${publicationId}`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        // Call the onDelete prop to update the parent component's state
        onDelete(publicationId);
        toast({
          title: "Success",
          description: response.data.message || "Publication deleted successfully",
        });
      } else {
        throw new Error(response.data.message || "Failed to delete publication");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to delete publication",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const sortedPublications = [...publications].sort((a, b) => {
    if (!sortField) return 0;
    const valueA = a[sortField] || "";
    const valueB = b[sortField] || "";

    if (sortField === "year") {
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    }
    return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
  });

  const totalPages = Math.max(1, Math.ceil(sortedPublications.length / ITEMS_PER_PAGE));
  const paginatedPublications = sortedPublications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            {[
              { label: "Title", field: "title" },
              { label: "Type", field: "publicationType" },
              { label: "Author(s)", field: "author" },
              { label: "Year", field: "year" },
              { label: "DOI", field: "doi" },
            ].map(({ label, field }) => (
              <TableHead key={field} className="cursor-pointer" onClick={() => handleSortClick(field)}>
                <div className="flex items-center gap-1">
                  {label} <ArrowUpDown size={14} className="opacity-50" />
                </div>
              </TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedPublications.length > 0 ? (
            paginatedPublications.map((publication) => (
              <TableRow key={publication.id}>
                <TableCell>{publication.title}</TableCell>
                <TableCell>{publication.publicationType}</TableCell>
                <TableCell>{publication.author}</TableCell>
                <TableCell>{publication.year}</TableCell>
                <TableCell>
                  {publication.doi ? (
                    <a 
                      href={`https://doi.org/${publication.doi}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {publication.doi}
                    </a>
                  ) : "N/A"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <button
                      className="px-2 py-1 bg-blue-100 font-medium text-blue-600 rounded hover:bg-blue-400 text-sm"
                      onClick={() => setSelectedPublication(publication)}
                    >
                      VIEW
                    </button>
                    <button
                      className="px-2 py-1 bg-red-100 font-medium text-red-600 rounded hover:bg-red-400 text-sm flex items-center"
                      onClick={() => handleDelete(publication.id)}
                      disabled={isDeleting}
                    >
                      DELETE
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                No publications found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(currentPage * ITEMS_PER_PAGE, sortedPublications.length)}
            </span>{' '}
            of <span className="font-medium">{sortedPublications.length}</span> results
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="px-2">...</span>
              )}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </Button>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </Button>
          </div>
        </div>
      )}

      {/* Publication Details Modal (unchanged) */}
      {selectedPublication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium text-gray-800">Publication Details</h3>
              <button onClick={() => setSelectedPublication(null)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">TITLE</h4>
                  <p className="font-medium text-gray-900">{selectedPublication.title}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">TYPE</h4>
                  <p className="font-medium text-gray-900">{selectedPublication.publicationType}</p>
                </div>
              </div>

              <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">AUTHOR(S)</h4>
                    <p className="font-medium text-gray-900">{selectedPublication.author}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">YEAR</h4>
                    <p className="font-medium text-gray-900">{selectedPublication.year}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">ORCID ID</h4>
                    <p className="font-medium text-gray-900">
                      {selectedPublication.orcidId || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">DOI</h4>
                    <p className="font-medium text-gray-900">
                      {selectedPublication.doi ? (
                        <a 
                          href={`https://doi.org/${selectedPublication.doi}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {selectedPublication.doi}
                        </a>
                      ) : "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">COLLABORATORS</h4>
                  <p className="font-medium text-gray-900">
                    {selectedPublication.collaborators || "N/A"}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">KEYWORDS</h4>
                  <p className="font-medium text-gray-900">
                    {selectedPublication.keywords || "N/A"}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">ABSTRACT</h4>
                  <p className="font-medium text-gray-900 whitespace-pre-line">
                    {selectedPublication.abstractContent || "N/A"}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">DESCRIPTION</  h4>
                  <p className="font-medium text-gray-900">
                    {selectedPublication.description || "N/A"}
                  </p>
                </div>

                {!isFaculty && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">FACULTY COMMENTS</  h4>
                    <p className="font-medium text-gray-900">
                      {selectedPublication.comments || "No comments available"}
                    </p>
                  </div>
                )}
              </div>

              {selectedPublication.documentPath && (
                <div className="p-4 rounded-lg border border-blue-50 bg-blue-50">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">FULL TEXT</  h4>
                  <button
                    onClick={() => handleDownload(selectedPublication.id)}
                    className="px-4 py-2 bg-white text-blue-600 rounded-md border border-blue-200 hover:bg-blue-100 flex items-center gap-2"
                  >
                    <Download size={16} />
                    Download 
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyPublicationsTable;