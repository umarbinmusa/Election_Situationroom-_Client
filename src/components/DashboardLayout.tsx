import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    // h-screen locks the window layout so it never stretches beyond the browser viewport
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
      
      {/* Sidebar stays fixed on the left side of the screen */}
      <Sidebar />

      {/* Main workspace area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Topbar />
        
        {/* Only this main tag will scroll when your incident content gets long */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

    </div>
  );
}