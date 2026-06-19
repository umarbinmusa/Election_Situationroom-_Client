import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  LogOut,
  MapPin,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Vote,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const username = localStorage.getItem("username") || "Admin";
  const userRole = (localStorage.getItem("role") || "")
    .toUpperCase()
    .trim();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const NavItem = ({ to, icon: Icon, children }: any) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
          isActive
            ? "bg-indigo-600 text-white"
            : "text-gray-500 hover:bg-gray-50"
        }`
      }
    >
      <Icon size={20} />
      {!isCollapsed && <span>{children}</span>}
    </NavLink>
  );

  return (
    <aside className={`h-screen bg-white border-r flex flex-col ${isCollapsed ? "w-20" : "w-72"}`}>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-6 right-[-12px] bg-white border rounded-full p-1"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="p-4 font-bold flex items-center gap-2">
        <Vote />
        {!isCollapsed && "Election Core"}
      </div>

      <nav className="flex-1 px-2 space-y-1">

        {/* ADMIN */}
        {userRole === "ADMIN" && (
          <>
            <NavItem to="/create-director" icon={LayoutDashboard}>
              Create ICT Director
            </NavItem>

            <NavItem to="/create-lga" icon={LayoutDashboard}>
              Create LGA Director
            </NavItem>

            <NavItem to="/create-ward" icon={LayoutDashboard}>
              Create Ward Director
            </NavItem>

            <NavItem to="/create-pollinunit" icon={LayoutDashboard}>
              Create Polling Unit Officer
            </NavItem>
          </>
        )}

        {/* ICT */}
        {userRole === "ICT_DIRECTOR" && (
          <NavItem to="/dashboard" icon={LayoutDashboard}>
            Create LGA Director
          </NavItem>
        )}

        {/* LGA ICT */}
        {userRole === "LGA_ICT_DIRECTOR" && (
          <NavItem to="/dashboard" icon={LayoutDashboard}>
            Create Ward Director
          </NavItem>
        )}

        {/* WARD ICT */}
        {userRole === "WARD_ICT_DIRECTOR" && (
          <NavItem to="/dashboard" icon={LayoutDashboard}>
            Create Polling Unit Officer
          </NavItem>
        )}

        {/* SHARED */}
        <NavItem to="/incidents" icon={ClipboardList}>
          Incidents
        </NavItem>

        <NavItem to="/createincident" icon={PlusCircle}>
          Create Incident
        </NavItem>

        <NavItem to="/polling-units" icon={MapPin}>
          Polling Units
        </NavItem>

        <NavItem to="/results" icon={BarChart3}>
          Election Results
        </NavItem>

      </nav>

      <div className="p-3 border-t">
        <button onClick={logout} className="flex items-center gap-2 text-red-500">
          <LogOut size={18} />
          {!isCollapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}