import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./components/student/StudentDashboardLayout";
import FacultyDashboardLayout from "./components/faculty/FacultyDashboardLayout";
import AdminDashboardLayout from "./components/admin/AdminDashboardLayout";
import Dashboard from "./pages/student/Dashboard";
import Technical from "./pages/student/Technical";
import Cultural from "./pages/student/Cultural";
import Sports from "./pages/student/SportsEvents";
import Clubs from "./pages/student/ClubsAndSocieties";
import JobOpportunity from "./pages/student/JobOpportunity";
import Publications from "./pages/student/Publications";
import RecordHistory from "./pages/student/RecordHistory";
import Export from "./pages/student/Export";
import NotFound from "./pages/NotFound";

// Faculty pages
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import StudentProfiles from "./pages/faculty/StudentProfiles";
import ProfileVerification from "./pages/faculty/ProfileVerification";
import FacultyPublications from "./pages/faculty/FacultyPublications";
import FlagRecords from "./pages/faculty/FlagRecords";
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

    {/* Student routes - Added :id to the path */}
    <Route path="/dashboard/:id" element={<DashboardLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="technical" element={<Technical />} />
      <Route path="cultural" element={<Cultural />} />
      <Route path="sports" element={<Sports />} />
      <Route path="clubs" element={<Clubs />} />
      <Route path="job" element={<JobOpportunity />} />
      <Route path="publications" element={<Publications />} />
      <Route path="history" element={<RecordHistory />} />
      <Route path="export" element={<Export />} />
    </Route>

    {/* Faculty routes - Added :id to the path */}
    <Route path="/faculty/:id" element={<FacultyDashboardLayout />}>
      <Route index element={<FacultyDashboard />} />
      <Route path="student-profiles" element={<StudentProfiles />} />
      <Route path="profile-verification" element={<ProfileVerification />} />
      <Route path="faculty-publications" element={<FacultyPublications />} />
      <Route path="flag-records" element={<FlagRecords />} />
      <Route path="export-details" element={<ExportDetails />} />
    </Route>

    {/* Admin routes - Added :id to the path */}
    <Route path="/admin/:id" element={<AdminDashboardLayout />}>
      <Route index element={<AdminDashboard />} />
      <Route path="student-profiles" element={<AdminStudentProfiles />} />
      <Route path="faculty-profiles" element={<FacultyProfiles />} />
      <Route path="flagged-records" element={<FlaggedRecords />} />
      <Route path="edit-fields" element={<EditFields />} />
      <Route path="import-details" element={<ImportDetails />} />
      <Route path="export-details" element={<AdminExportDetails />} />
    </Route>

    {/* 404 Page */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <BrowserRouter future={{ v7_relativeSplatPath: true }}>
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        {/* Tooltip wrapper (for better UI interactions) */}
        <TooltipProvider>
          {/* ✅ RENDER TOASTER AT GLOBAL LEVEL */}
          <Sonner />
          <Toaster />
          <AppRoutes />
        </TooltipProvider>
      </QueryClientProvider>
    </UserProvider>
  </BrowserRouter>
);

export default App;



// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { UserProvider } from "./contexts/UserContext";
// import LoginPage from "./pages/LoginPage";
// import DashboardLayout from "./components/student/StudentDashboardLayout";
// import FacultyDashboardLayout from "./components/faculty/FacultyDashboardLayout";
// import AdminDashboardLayout from "./components/admin/AdminDashboardLayout";
// import Dashboard from "./pages/student/Dashboard";
// import Technical from "./pages/student/Technical";
// import Cultural from "./pages/student/Cultural";
// import Sports from "./pages/student/Sports";
// import Clubs from "./pages/student/Clubs";
// import JobOpportunity from "./pages/student/JobOpportunity";
// import Publications from "./pages/student/Publications";
// import RecordHistory from "./pages/student/RecordHistory";
// import Export from "./pages/student/Export";
// import NotFound from "./pages/NotFound";

// // Faculty pages
// import FacultyDashboard from "./pages/faculty/FacultyDashboard";
// import StudentProfiles from "./pages/faculty/StudentProfiles";
// import ProfileVerification from "./pages/faculty/ProfileVerification";
// import ExportDetails from "./pages/faculty/ExportDetails";

// // Admin pages
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import AdminStudentProfiles from "./pages/admin/StudentProfiles";
// import FacultyProfiles from "./pages/admin/FacultyProfiles";
// import FlaggedRecords from "./pages/admin/FlaggedRecords";
// import EditFields from "./pages/admin/EditFields";
// import ImportDetails from "./pages/admin/ImportDetails";
// import AdminExportDetails from "./pages/admin/ExportDetails";

// const queryClient = new QueryClient();

// const AppRoutes = () => (
//   <Routes>
//     {/* Redirect root to login page */}
//     <Route path="/" element={<Navigate to="/login" replace />} />
//     <Route path="/login" element={<LoginPage />} />
    
//     {/* Student routes */}
//     <Route path="/dashboard/:id" element={<DashboardLayout />}>
//       <Route index element={<Dashboard />} />
//       <Route path="technical" element={<Technical />} />
//       <Route path="cultural" element={<Cultural />} />
//       <Route path="sports" element={<Sports />} />
//       <Route path="clubs" element={<Clubs />} />
//       <Route path="internships" element={<JobOpportunity />} />
//       <Route path="publications" element={<Publications />} />
//       <Route path="history" element={<RecordHistory />} />
//       <Route path="export" element={<Export />} />
//     </Route>
    
//     {/* Faculty routes */}
//     <Route path="/faculty/:id" element={<FacultyDashboardLayout />}>
//       <Route index element={<FacultyDashboard />} />
//       <Route path="student-profiles" element={<StudentProfiles />} />
//       <Route path="profile-verification" element={<ProfileVerification />} />
//       <Route path="export-details" element={<ExportDetails />} />
//     </Route>
    
//     {/* Admin routes */}
//     <Route path="/admin" element={<AdminDashboardLayout />}>
//       <Route index element={<AdminDashboard />} />
//       <Route path="student-profiles" element={<AdminStudentProfiles />} />
//       <Route path="faculty-profiles" element={<FacultyProfiles />} />
//       <Route path="flagged-records" element={<FlaggedRecords />} />
//       <Route path="edit-fields" element={<EditFields />} />
//       <Route path="import-details" element={<ImportDetails />} />
//       <Route path="export-details" element={<AdminExportDetails />} />
//     </Route>
    
//     <Route path="/not-found" element={<NotFound />} />
//   </Routes>
// );

// const App = () => (

//       <BrowserRouter>
//         <AuthProvider>
//           <AppRoutes />
//         </AuthProvider>
//       </BrowserRouter>
  
// );

// export default App;        