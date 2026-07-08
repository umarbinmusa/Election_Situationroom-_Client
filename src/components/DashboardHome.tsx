import React from "react";
import { useQuery } from "@apollo/client/react";
import { GET_ELECTION_SUMMARY } from "../graphql/queries";
import CreateLGADirector from "../pages/CreateLGADirector";
import CreateWardDirector from "../pages/CreateWardDirector";
import CreatePollingUnitOfficer from "../pages/CreatePollingUnitOfficer";
import CreateICTDirector from "../pages/CreateICTDirector";
import { 
  Trophy, 
  Vote, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  Loader2 
} from "lucide-react";

export default function DashboardHome() {
  const role = (localStorage.getItem("role") || "").toUpperCase();
  const { loading, error, data } = useQuery(GET_ELECTION_SUMMARY);

  // Determine administrative action form based on user hierarchy
  let dashboardContent;
  let actionTitle = "";

  switch (role) {
    case "ADMIN":
      dashboardContent = <CreateICTDirector />;
      actionTitle = "Provision New State ICT Director";
      break;
    case "ICT_DIRECTOR":
      dashboardContent = <CreateLGADirector />;
      actionTitle = "Provision New Local Government Area (LGA) Director";
      break;
    case "LGA_DIRECTOR":
    case "LGA_ICT_DIRECTOR":
      dashboardContent = <CreateWardDirector />;
      actionTitle = "Provision New Ward Director";
      break;
    case "WARD_DIRECTOR":
    case "WARD_ICT_DIRECTOR":
      dashboardContent = <CreatePollingUnitOfficer />;
      actionTitle = "Register New Polling Unit Officer";
      break;
    default:
      actionTitle = "System Management";
      dashboardContent = (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <ShieldCheck className="text-gray-300 mb-2" size={36} />
          <p className="text-sm font-semibold text-gray-700">Operational Role Clear</p>
          <p className="text-xs text-gray-400 mt-1">No administrative management forms assigned to this security clearance level.</p>
        </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-gray-50/50 min-h-screen">
      
      {/* Top Operations Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {role.replace("_", " ")} Workspace
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live System Connection" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Operations Dashboard</h1>
          <p className="text-sm text-gray-500 font-medium">Real-time command center for telemetry gathering and administrative node management.</p>
        </div>
      </div>

      {/* Main Structural Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Election Telemetry (Spans 7 blocks) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-indigo-600" size={20} />
              <h2 className="text-lg font-bold text-gray-900">Election Returns Summary</h2>
            </div>
          </div>

          <div className="p-6">
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 space-y-3">
                <Loader2 className="text-indigo-600 animate-spin" size={32} />
                <p className="text-sm font-medium text-gray-500">Aggregating real-time tallies...</p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-xl flex items-center gap-3 text-red-700">
                <AlertTriangle size={20} className="shrink-0 text-red-500" />
                <p className="text-xs font-semibold leading-relaxed">{error.message || "Failed to load telemetry data."}</p>
              </div>
            )}

            {data?.electionSummary && (
              <div className="space-y-6">
                {/* Executive Micro-Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Winner Card */}
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50/30 border border-emerald-100/70 rounded-xl p-4 flex items-center gap-4">
                    <div className="p-3 bg-emerald-500 text-white rounded-xl shadow-md shadow-emerald-500/10">
                      <Trophy size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-emerald-700/80 tracking-wide">Projected Leader</p>
                      <p className="text-lg font-black text-gray-900 leading-tight mt-0.5">{data.electionSummary.winner || "TBD"}</p>
                    </div>
                  </div>

                  {/* Volume Card */}
                  <div className="bg-gradient-to-br from-indigo-50 to-sky-50/30 border border-indigo-100/70 rounded-xl p-4 flex items-center gap-4">
                    <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-600/10">
                      <Vote size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-indigo-700/80 tracking-wide">Total Ballots Cast</p>
                      <p className="text-lg font-black text-gray-900 leading-tight mt-0.5">
                        {Number(data.electionSummary.totalVotes).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tabular Distribution Matrix */}
                <div className="overflow-x-auto border border-gray-100 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-[10px] uppercase font-black tracking-wider">
                        <th className="py-3.5 px-4 flex items-center gap-1.5"><Users size={12} /> Candidate Profile</th>
                        <th className="py-3.5 px-4 text-right">Votes Apportioned</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                      {data.electionSummary.results.map((candidate, idx) => {
                        const totalVotes = data.electionSummary.totalVotes || 1;
                        const percentage = Math.min(100, Math.round((candidate.totalVotes / totalVotes) * 100));

                        return (
                          <tr key={candidate.candidate} className="hover:bg-gray-50/80 transition-colors">
                            <td className="py-4 px-4 font-semibold text-gray-800">
                              <div className="space-y-1.5">
                                <span className="block">{candidate.candidate}</span>
                                {/* Visual breakdown meter line */}
                                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden max-w-xs">
                                  <div 
                                    className={`h-full rounded-full ${idx === 0 ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right align-top font-mono font-bold text-gray-900">
                              <div>{Number(candidate.totalVotes).toLocaleString()}</div>
                              <span className="text-[10px] text-gray-400 font-sans font-semibold">({percentage}%)</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Administrative Action Form Area (Spans 5 blocks) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">{actionTitle}</h2>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Authorization cleared to append structural nodes to the register.</p>
          </div>
          <div className="p-6 bg-gray-50/20">
            {dashboardContent}
          </div>
        </div>

      </div>
    </div>
  );
}