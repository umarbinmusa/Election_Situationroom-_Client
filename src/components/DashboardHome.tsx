import React from "react";
import { useQuery,  } from "@apollo/client/react";
import { BarChart3, Clock, CheckCircle2, ShieldAlert, AlertCircle } from "lucide-react";
import {GET_DASHBOARD_STATS} from "../graphql/queries"
// 1. Define the GraphQL query matching your resolver output


export default function DashboardHome() {
  // 2. Fetch the data hook from your Apollo client integration
  const { loading, error, data } = useQuery(GET_DASHBOARD_STATS, {
    pollInterval: 15000, // Optional: Polls real-time data from server every 15 seconds
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center gap-3">
        <AlertCircle size={20} />
        <span>Failed to load control room metrics. {error.message}</span>
      </div>
    );
  }

  const {
    totalIncidents,
    pendingIncidents,
    verifiedIncidents,
    resolvedIncidents,
  } = data.dashboardStats;

  // Configuration matrix for UI consistency
  const statsConfig = [
    {
      title: "Total Logged Incidents",
      value: totalIncidents,
      icon: BarChart3,
      color: "bg-gray-50 text-gray-700 border-gray-100",
      iconBg: "bg-gray-100 text-gray-600",
    },
    {
      title: "Pending Evaluation",
      value: pendingIncidents,
      icon: Clock,
      color: "bg-amber-50/60 text-amber-700 border-amber-100",
      iconBg: "bg-amber-100 text-amber-600",
    },
    {
      title: "Verified Breaches",
      value: verifiedIncidents,
      icon: ShieldAlert,
      color: "bg-rose-50/60 text-rose-700 border-rose-100",
      iconBg: "bg-rose-100 text-rose-600",
    },
    {
      title: "Resolved Actions",
      value: resolvedIncidents,
      icon: CheckCircle2,
      color: "bg-emerald-50/60 text-emerald-700 border-emerald-100",
      iconBg: "bg-emerald-100 text-emerald-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Context Description Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">System Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time terminal summary metrics for tracked application incidents.</p>
      </div>

      {/* Grid Display for Dashboard Metric Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsConfig.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={idx}
              className={`p-6 bg-white border ${stat.color} rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md flex items-center justify-between`}
            >
              <div className="space-y-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  {stat.title}
                </span>
                <span className="text-3xl font-black text-gray-900 tracking-tight block">
                  {stat.value.toLocaleString()}
                </span>
              </div>
              
              <div className={`p-3 rounded-xl ${stat.iconBg} flex items-center justify-center shrink-0`}>
                <IconComponent size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Workspace Activity Mockup Area */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 min-h-[250px] flex flex-col justify-center items-center text-center">
        <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
          <BarChart3 size={22} />
        </div>
        <h3 className="text-sm font-bold text-gray-900">Activity Engine Standby</h3>
        <p className="text-xs text-gray-400 max-w-sm mt-1">
          Select "Incidents" or "Create Incident" from the stationary sidebar console to manipulate database properties directly.
        </p>
      </div>
    </div>
  );
}