
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
console.log("Fine")

import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
console.log("Fine2")

import DashboardLayout from "./components/student/StudentDashboardLayout";

console.log("Fine3")
import FacultyDashboardLayout from "./components/faculty/FacultyDashboardLayout";
import AdminDashboardLayout from "./components/admin/AdminDashboardLayout";
import Dashboard from "./pages/student/Dashboard";
import Technical from "./pages/student/Technical";
import Cultural from "./pages/student/Cultural";
import Sports from "./pages/student/Sports";
import Clubs from "./pages/student/Clubs";
import Internships from "./pages/student/Internships";
import Publications from "./pages/student/Publications";
import History from "./pages/student/History";
import NotFound from "./pages/NotFound";

// Faculty pages
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import StudentProfiles from "./pages/faculty/StudentProfiles";
import ProfileVerification from "./pages/faculty/ProfileVerification";
import ExportDetails from "./pages/faculty/ExportDetails";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudentProfiles from "./pages/admin/StudentProfiles";
import FacultyProfiles from "./pages/admin/FacultyProfiles";
import FlaggedRecords from "./pages/admin/FlaggedRecords";
import EditFields from "./pages/admin/EditFields";
import ImportDetails from "./pages/admin/ImportDetails";
import AdminExportDetails from "./pages/admin/ExportDetails";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    {/* Redirect root to login page */}
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<LoginPage />} />
    
    {/* Student routes */}
    <Route path="/dashboard" element={<DashboardLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="technical" element={<Technical />} />
      <Route path="cultural" element={<Cultural />} />
      <Route path="sports" element={<Sports />} />
      <Route path="clubs" element={<Clubs />} />
      <Route path="internships" element={<Internships />} />
      <Route path="publications" element={<Publications />} />
      <Route path="history" element={<History />} />
    </Route>
    
    {/* Faculty routes */}
    <Route path="/faculty" element={<FacultyDashboardLayout />}>
      <Route index element={<FacultyDashboard />} />
      <Route path="student-profiles" element={<StudentProfiles />} />
      <Route path="profile-verification" element={<ProfileVerification />} />
      <Route path="export-details" element={<ExportDetails />} />
    </Route>
    
    {/* Admin routes */}
    <Route path="/admin" element={<AdminDashboardLayout />}>
      <Route index element={<AdminDashboard />} />
      <Route path="student-profiles" element={<AdminStudentProfiles />} />
      <Route path="faculty-profiles" element={<FacultyProfiles />} />
      <Route path="flagged-records" element={<FlaggedRecords />} />
      <Route path="edit-fields" element={<EditFields />} />
      <Route path="import-details" element={<ImportDetails />} />
      <Route path="export-details" element={<AdminExportDetails />} />
    </Route>
    
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
