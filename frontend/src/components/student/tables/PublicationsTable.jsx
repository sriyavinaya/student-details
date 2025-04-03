import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, Download, X } from "lucide-react";
import axios from "axios";

const ITEMS_PER_PAGE = 10;

const PublicationsTable = ({ publications = [] }) => {
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPublication, setSelectedPublication] = useState(null);

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
      alert("Failed to download file");
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
              { label: "Status", field: "verificationStatus" }
            ].map(({ label, field }) => (
              <TableHead key={field} className="cursor-pointer" onClick={() => handleSortClick(field)}>
                <div className="flex items-center gap-1">
                  {label} <ArrowUpDown size={14} className="opacity-50" />
                </div>
              </TableHead>
            ))}
            <TableHead>Action</TableHead>
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
                  <span className={`text-sm font-semibold ${
                    publication.verificationStatus === "Pending" ? "text-yellow-500" :
                    publication.verificationStatus === "Approved" ? "text-green-600" : "text-red-600"
                  }`}>
                    {publication.verificationStatus}
                  </span>
                </TableCell>
                <TableCell>
                  <button
                    className="px-2 py-1 bg-blue-100 font-medium text-blue-600 rounded hover:bg-blue-400 text-sm"
                    onClick={() => setSelectedPublication(publication)}
                  >
                    VIEW
                  </button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                No publications found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center p-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Publication Details Modal */}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-100 p-4 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">TITLE</h4>
                  <p className="font-medium text-gray-900">{selectedPublication.title}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">TYPE</h4>
                  <p className="font-medium text-gray-900">{selectedPublication.publicationType}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">STATUS</h4>
                  <p className={`font-medium ${
                    selectedPublication.verificationStatus === "Pending" ? "text-yellow-600" :
                    selectedPublication.verificationStatus === "Approved" ? "text-green-600" :
                    "text-red-600"
                  }`}>
                    {selectedPublication.verificationStatus}
                  </p>
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
                  <h4 className="text-sm font-medium text-gray-500">DESCRIPTION</h4>
                  <p className="font-medium text-gray-900">
                    {selectedPublication.description || "N/A"}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">FACULTY COMMENTS</h4>
                  <p className="font-medium text-gray-900">
                    {selectedPublication.comments || "No comments available"}
                  </p>
                </div>
              </div>

              {selectedPublication.documentPath && (
                <div className="p-4 rounded-lg border border-blue-50 bg-blue-50">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">FULL TEXT</h4>
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

export default PublicationsTable;