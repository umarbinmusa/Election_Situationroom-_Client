// DashboardHome.jsx

import React from "react";
import CreateLGADirector from "../pages/CreateLGADirector";
import CreateWardDirector from "../pages/CreateWardDirector";
import CreatePollingUnitOfficer from "../pages/CreatePollingUnitOfficer";
import CreateICTDirector from "../pages/CreateICTDirector";

export default function DashboardHome() {
 const role = (localStorage.getItem("role") || "").toUpperCase();
if (role === "ADMIN") {
  return <CreateICTDirector />;
}

if (role === "ICT_DIRECTOR") {
  return <CreateLGADirector />;
}

if (
  role === "LGA_DIRECTOR" ||
  role === "LGA_ICT_DIRECTOR"
) {
  return <CreateWardDirector />;
}

if (
  role === "WARD_DIRECTOR" ||
  role === "WARD_ICT_DIRECTOR"
) {
  return <CreatePollingUnitOfficer />;
}
console.log("Stored Role:", role);

  switch (role) {
    case "ICT_DIRECTOR":
      return <CreateLGADirector />;

    case "LGA_DIRECTOR":
      return <CreateWardDirector />;

    case "WARD_DIRECTOR":
      return <CreatePollingUnitOfficer />;

    default:
      return (
        <div className="p-6">
          <h2>No dashboard assigned to this role.</h2>
        </div>
      );
  }
}