import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_INCIDENTS_QUERY } from "../graphql/queries";
import {
  DELETE_INCIDENT_MUTATION,
  UPDATE_INCIDENT_STATUS_MUTATION,
} from "../graphql/mutations";

interface UserPayload {
  id: string;
  username: string;
  role: string;
}

interface IncidentPayload {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  location: string;
  reportedBy?: UserPayload;
}

interface QueryData {
  getIncidents: IncidentPayload[];
}

export const IncidentDashboard: React.FC = () => {
  const { loading, error, data } = useQuery<QueryData>(GET_INCIDENTS_QUERY);

  const [deleteIncident] = useMutation(DELETE_INCIDENT_MUTATION, {
    refetchQueries: [GET_INCIDENTS_QUERY],
  });

  const [updateIncidentStatus] = useMutation(UPDATE_INCIDENT_STATUS_MUTATION, {
    refetchQueries: [GET_INCIDENTS_QUERY],
  });

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this incident?");
    if (!confirmed) return;

    try {
      await deleteIncident({ variables: { id } });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateIncidentStatus({ variables: { id, status } });
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-slate-500 font-medium animate-pulse">Syncing real-time feed...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-10">
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center space-x-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-semibold">Failed to load system data</p>
            <p className="text-sm opacity-90">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const incidents = data?.getIncidents ?? [];

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Modern Dynamic Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Incident Control Center</h1>
            <p className="text-slate-500 mt-1 text-sm">Monitor, verify, and resolve active platform issues.</p>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-600 bg-white shadow-sm border px-3 py-1.5 rounded-lg">
              {incidents.length} Active System Nodes
            </span>
          </div>
        </div>

        {incidents.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center max-w-xl mx-auto mt-12">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-lg font-bold text-slate-900">All clear!</h3>
            <p className="text-slate-500 text-sm mt-1">No outstanding incidents found in the active database queue.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Stream View */}
            <div className="lg:col-span-2 space-y-4">
              {incidents.map((incident) => (
                <IncidentCard
                  key={incident.id}
                  incident={incident}
                  onDelete={handleDelete}
                  onUpdateStatus={handleStatusUpdate}
                />
              ))}
            </div>

            {/* Right Mini-Insights Dynamic Bar */}
            <div className="space-y-4 lg:sticky lg:top-6">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-lg">
                <h4 className="font-bold text-indigo-400 uppercase tracking-wider text-xs">Response Matrix</h4>
                <p className="text-2xl font-bold mt-2">Operations Center</p>
                <div className="mt-4 space-y-2 text-sm text-slate-300">
                  <div className="flex justify-between border-b border-slate-700/50 pb-2">
                    <span>Pending Processing:</span>
                    <span className="font-semibold text-amber-400">{incidents.filter(i => i.status === 'PENDING').length}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-700/50 pb-2">
                    <span>Under Investigation:</span>
                    <span className="font-semibold text-sky-400">{incidents.filter(i => i.status === 'VERIFIED').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mitigated / Resolved:</span>
                    <span className="font-semibold text-emerald-400">{incidents.filter(i => i.status === 'RESOLVED').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface CardProps {
  incident: IncidentPayload;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
}

const IncidentCard: React.FC<CardProps> = ({
  incident,
  onDelete,
  onUpdateStatus,
}) => {
  const [status, setStatus] = useState(incident.status);

  // Dynamic Badge Color Controller
  const getStatusStyles = (currentStatus: string) => {
    switch (currentStatus.toUpperCase()) {
      case "RESOLVED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "VERIFIED":
        return "bg-sky-50 text-sky-700 border-sky-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md hover:border-slate-200 transition duration-200">
      
      {/* Header Info Banner */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Node ID: #{incident.id.slice(-6)}</span>
          <h3 className="text-xl font-bold text-slate-900 mt-1 tracking-tight">{incident.title}</h3>
        </div>
        <span className={`px-3 py-1 text-xs font-bold tracking-wide rounded-full border ${getStatusStyles(incident.status)}`}>
          {incident.status}
        </span>
      </div>

      {/* Description Context Area */}
      <p className="text-slate-600 text-sm leading-relaxed mb-5">
        {incident.description}
      </p>

      {/* Structured Asset Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl text-xs mb-6 border border-slate-100/60">
        <div>
          <span className="text-slate-400 uppercase tracking-wider block mb-0.5 font-medium">Category</span>
          <span className="font-semibold text-slate-700 block truncate">📁 {incident.category}</span>
        </div>
        <div>
          <span className="text-slate-400 uppercase tracking-wider block mb-0.5 font-medium">Location</span>
          <span className="font-semibold text-slate-700 block truncate">📍 {incident.location}</span>
        </div>
        <div>
          <span className="text-slate-400 uppercase tracking-wider block mb-0.5 font-medium">Reporter</span>
          <span className="font-semibold text-slate-700 block truncate">👤 {incident.reportedBy?.username ?? "Anonymous"}</span>
        </div>
        <div>
          <span className="text-slate-400 uppercase tracking-wider block mb-0.5 font-medium">Clearance Role</span>
          <span className="font-semibold text-slate-700 block truncate">🛡️ {incident.reportedBy?.role ?? "N/A"}</span>
        </div>
      </div>

      {/* Quick Action Controller Console */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center pt-2">
        <div className="flex items-center gap-2 flex-1 sm:max-w-sm">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-white border border-slate-200 text-sm rounded-xl px-3 py-2 text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          >
            <option value="PENDING">PENDING</option>
            <option value="VERIFIED">VERIFIED</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>

          <button
            onClick={() => onUpdateStatus(incident.id, status)}
            className="whitespace-nowrap px-4 py-2 bg-slate-900 text-white font-medium text-xs rounded-xl shadow-sm hover:bg-slate-800 transition"
          >
            Update Node
          </button>
        </div>

        <button
          onClick={() => onDelete(incident.id)}
          className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 font-semibold text-xs rounded-xl hover:bg-rose-100 hover:text-rose-700 transition text-center"
        >
          Purge Log Record
        </button>
      </div>
      
    </div>
  );
};

export default IncidentDashboard;