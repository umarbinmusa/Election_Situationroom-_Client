import { Routes, Route, Navigate } from "react-router-dom";
import { SignupForm as Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import { CreateIncident } from "./pages/CreateIncident";
import  IncidentDetails  from "./pages/IncidentDetails";
import { IncidentDashboard } from "./pages/IncidentDashboard";
import  UpdateStatus  from "./pages/UpdateStatus";
import DashboardHome from "./components/DashboardHome";
import DashboardLayout from "./components/DashboardLayout"; 
import PollingUnits from "./pages/PollingUnits";
import ElectionResults from "./pages/ElectionResults";
import ElectionSummaryDashboard from "./Pages/ElectionSummaryDashboard";
import CreateICTDirector from "./Pages/CreateICTDirector";
export default function App() {
  return (
    <Routes>
      {/* --- AUTHENTICATION ROUTES (No Sidebar/Topbar) --- */}
      <Route path="/" element={<Login />} />
      
      <Route path="/login" element={<Login />} />

      {/* --- APPLICATION ROUTES (Wrapped inside the Fixed Layout) --- */}
      <Route element={<DashboardLayout />}>
        {/* Core Workspace Home */}
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/polling-units" element={<PollingUnits />} />
        <Route path="/results" element={<ElectionResults />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/summary" element={<ElectionSummaryDashboard />} />
        <Route path="/create-director" element={<CreateICTDirector />} />
        {/* Incident Logs Dashboard */}
        <Route path="/incidents" element={<IncidentDashboard />} />
        
        {/* Management & Actions */}
        <Route path="/createincident" element={<CreateIncident />} />
        <Route path="/incidents/details" element={<IncidentDetails />} />
        <Route path="/updatestatus" element={<UpdateStatus />} />
      </Route>

      {/* Wildcard Fallback: Redirect unrecognized URLs back to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}