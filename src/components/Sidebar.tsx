import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Vote,
  UserCheck,
  ShieldAlert,
  BarChart3,
  MapPin,
  Building2
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const username = localStorage.getItem("username") || "Operations User";
  const userRole = (localStorage.getItem("role") || "").toUpperCase().trim();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const NavItem = ({ to, icon: Icon, children }: any) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
          isActive
            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
        }`
      }
    >
      <Icon size={18} className="shrink-0 transition-transform group-hover:scale-105" />
      {!isCollapsed && <span className="truncate">{children}</span>}
    </NavLink>
  );

  return (
    <aside 
      className={`h-screen bg-white border-r border-gray-100 flex flex-col justify-between relative transition-all duration-300 ease-in-out z-20 ${
        isCollapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Structural Top Wrapper */}
      <div>
        {/* Sidebar Toggle Trigger Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-6 right-[-12px] bg-white border border-gray-100 rounded-full p-1 text-gray-400 hover:text-gray-700 shadow-sm transition-colors z-30"
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Corporate Brand Identity Panel */}
        <div className={`p-6 flex items-center gap-3 border-b border-gray-50 ${isCollapsed ? "justify-center" : ""}`}>
          <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
            <Vote size={22} className="stroke-[2.5]" />
          </div>
          {!isCollapsed && (
            <div className="leading-tight">
              <span className="block font-black text-gray-900 tracking-tight text-base">ElectionCore</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">HQ Platform</span>
            </div>
          )}
        </div>

        {/* System Scope Context Navigation Links */}
        <nav className="p-4 space-y-1.5">
          
          {/* Core App Landing */}
          <NavItem to="/dashboard" icon={LayoutDashboard}>Dashboard</NavItem>

          {/* ADMIN MANAGEMENT NODES */}
          {userRole === "ADMIN" && (
            <>
              <div className={`text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 pt-4 pb-2 ${isCollapsed ? "text-center" : ""}`}>
                {!isCollapsed ? "Provisioning Center" : "Admin"}
              </div>
              <NavItem to="/create-director" icon={UserCheck}>Create ICT Director</NavItem>
              <NavItem to="/create-lga" icon={Building2}>Create LGA Director</NavItem>
              <NavItem to="/create-ward" icon={MapPin}>Create Ward Director</NavItem>
              <NavItem to="/create-pollinunit" icon={PlusCircle}>Create PU Officer</NavItem>
            </>
          )}

          {/* ICT FIELD MANAGEMENT NODES */}
          {userRole === "ICT_DIRECTOR" && (
            <NavItem to="/create-lga" icon={Building2}>Create LGA Director</NavItem>
          )}

          {/* LGA LEVEL STRATA ACCESS */}
          {(userRole === "LGA_DIRECTOR" || userRole === "LGA_ICT_DIRECTOR") && (
            <NavItem to="/create-ward" icon={MapPin}>Create Ward Director</NavItem>
          )}

          {/* WARD LEVEL STRATA ACCESS */}
          {(userRole === "WARD_DIRECTOR" || userRole === "WARD_ICT_DIRECTOR") && (
            <NavItem to="/create-pollinunit" icon={UserCheck}>Create PU Officer</NavItem>
          )}

          {/* STANDARD CORE SHARED MONITORING TOOLS */}
          <div className={`text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 pt-4 pb-2 ${isCollapsed ? "text-center" : ""}`}>
            {!isCollapsed ? "Data Operations" : "Data"}
          </div>

          <NavItem to="/incidents" icon={ClipboardList}>Incidents Log</NavItem>
          <NavItem to="/createincident" icon={ShieldAlert}>Report Incident</NavItem>
          <NavItem to="/results" icon={BarChart3}>Election Returns</NavItem>
        </nav>
      </div>

      {/* Corporate User Session Account Panel Footer */}
      <div className="p-4 border-t border-gray-50 bg-gray-50/40 space-y-3">
        {!isCollapsed && (
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-xl flex items-center justify-center font-bold text-sm tracking-tight shadow-md shadow-indigo-600/10">
              {username.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 truncate leading-tight">{username}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate mt-0.5">
                {userRole.replace("_", " ")}
              </p>
            </div>
          </div>
        )}

        <button 
          onClick={logout} 
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-red-600 hover:bg-red-50/60 rounded-xl text-sm font-bold transition-all duration-200 group ${
            isCollapsed ? "justify-center" : ""
          }`}
          title="Sign out of workspace session"
        >
          <LogOut size={18} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}