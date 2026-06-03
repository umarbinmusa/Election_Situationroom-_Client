import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  ClipboardList, 
  PlusCircle, 
  LogOut, 
  Activity, 
  MapPin, 
  UserPlus, 
  BarChart3 
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  const linkClass = "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group hover:bg-indigo-50 hover:text-indigo-600 text-gray-600";
  const activeClass = "bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:text-white";

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const NavItem = ({ to, icon: Icon, children }) => (
    <NavLink to={to} className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
      <Icon size={20} className="shrink-0" />
      <span className="font-medium text-sm">{children}</span>
    </NavLink>
  );

  return (
    // h-full keeps the sidebar stretched top-to-bottom, shrink-0 stops it from compressing
    <aside className="w-72 h-full bg-white border-r border-gray-100 flex flex-col shrink-0">
      
      {/* Sidebar Header Brand Area */}
      <div className="p-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
            <Activity size={22} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">SITUATION</h1>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 bg-indigo-50 w-fit px-2 py-0.5 rounded mt-2">
          CONSOLE PANEL
        </p>
      </div>

      {/* Navigation Links Collection */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <NavItem to="/dashboard" icon={LayoutDashboard}>Dashboard</NavItem>
        
        <div className="pt-4 pb-2 px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          Management
        </div>
        <NavItem to="/incidents" icon={ClipboardList}>Incidents</NavItem>
        <NavItem to="/createincident" icon={PlusCircle}>Create Incident</NavItem>
        
        <div className="pt-4 pb-2 px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          Administration
        </div>
        <NavItem to="/signup" icon={UserPlus}>Create User Type</NavItem>
        <NavItem to="/polling-units" icon={MapPin}>Polling Units</NavItem>
        <NavItem to="/results" icon={BarChart3}>Election Results</NavItem>
      </nav>

      {/* Sidebar Action Footer */}
      <div className="p-4 border-t border-gray-50">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-500 rounded-xl hover:bg-red-50 transition-colors group"
        >
          <LogOut size={20} className="transition-transform group-hover:translate-x-0.5" />
          Logout
        </button>
      </div>

    </aside>
  );
}