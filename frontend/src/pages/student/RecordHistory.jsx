import React, { useState, useEffect } from "react";
import PageTemplate from "@/components/student/StudentPageTemplate";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useParams } from "react-router-dom";
import RecordHistoryTable from "@/components/student/tables/RecordHistoryTable";
import TechnicalEventsForm from "@/components/student/forms/TechnicalEventsForm";
import SportsEventsForm from "@/components/student/forms/SportsEventsForm";
import CulturalEventsForm from "@/components/student/forms/CulturalEventsForm";
import ClubsSocietiesForm from "@/components/student/forms/ClubsAndSocietiesForm";
import PublicationsForm from "../../components/student/forms/PublicationsForm";
import JobOpportunitiesForm from "../../components/student/forms/JobOpportunitiesForm";

const RecordHistory = () => {
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formComponent, setFormComponent] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const { toast } = useToast();
  const { id } = useParams();

  useEffect(() => {
    fetchRecords();
  }, [id]);

  const fetchRecords = async () => {
    try {
      const [pendingResponse, rejectedResponse] = await Promise.all([
        axios.get(`http://localhost:8080/api/main/student/${id}/pending`, { withCredentials: true }),
        axios.get(`http://localhost:8080/api/main/student/${id}/rejected`, { withCredentials: true })
      ]);

      const combinedRecords = [
        ...pendingResponse.data,
        ...rejectedResponse.data
      ].sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate));

      setRecords(combinedRecords);
    } catch (error) {
      console.error("Failed to fetch records", error);
      toast({
        title: "Error",
        description: "Failed to load records",
        variant: "destructive",
      });
    }
  };
  

  const handleDownload = async (recordId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/main/download/${recordId}`, {
        responseType: "blob",
        withCredentials: true,
      });
  
      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `document_${recordId}`;
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

  const handleResubmit = (record) => {
    setEditingRecord(record);
    
    switch(record.dtype) {
      case 'TechnicalEvent':
        setFormComponent(
          <TechnicalEventsForm
            event={record}
            onClose={() => setShowForm(false)}
            onSave={() => {
              setShowForm(false);
              fetchRecords();
              toast({
                title: "Success",
                description: "Technical event resubmitted successfully",
              });
            }}
          />
        );
        break;
      case 'SportsEvent':
        setFormComponent(
          <SportsEventsForm
            event={record}
            onClose={() => setShowForm(false)}
            onSave={() => {
              setShowForm(false);
              fetchRecords();
              toast({
                title: "Success",
                description: "Sports event resubmitted successfully",
              });
            }}
          />
        );
        break;
      case 'CulturalEvent':
        setFormComponent(
          <CulturalEventsForm
            event={record}
            onClose={() => setShowForm(false)}
            onSave={() => {
              setShowForm(false);
              fetchRecords();
              toast({
                title: "Success",
                description: "Cultural event resubmitted successfully",
              });
            }}
          />
        );
        break;
      case 'ClubsAndSocieties':
        setFormComponent(
          <ClubsSocietiesForm
            event={record}
            onClose={() => setShowForm(false)}
            onSave={() => {
              setShowForm(false);
              fetchRecords(); // This refreshes the table
              toast({
                title: "Success",
                description: "Club/Society event resubmitted successfully",
              });
            }}
          />
        );
        break;
        case 'JobOpportunities':
        setFormComponent(
          <JobOpportunitiesForm
            event={record}
            onClose={() => setShowForm(false)}
            onSave={() => {
              setShowForm(false);
              fetchRecords();
              toast({
                title: "Success",
                description: "Job opportunity resubmitted successfully",
              });
            }}
          />
        );
        break;
        case 'Publications':
        setFormComponent(
          <PublicationsForm
            event={record}
            onClose={() => setShowForm(false)}
            onSave={() => {
              setShowForm(false);
              fetchRecords();
              toast({
                title: "Success",
                description: "Publication resubmitted successfully",
              });
            }}
          />
        );
        break;
      default:
        toast({
          title: "Error",
          description: "Unknown record type",
          variant: "destructive",
        });
        return;
    }
    
    setShowForm(true);
  };

  return (
    <PageTemplate title="Record History">
      <RecordHistoryTable 
        records={records} 
        onResubmit={handleResubmit}
        onDownload={handleDownload} 
        onView={setSelectedRecord}
      />

      {showForm && formComponent}
    </PageTemplate>
  );
};

export default RecordHistory;