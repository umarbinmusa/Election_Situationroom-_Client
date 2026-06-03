import React, { useState } from "react";
import { useQuery, useMutation,  } from "@apollo/client/react";
import { MapPin, Search, Loader2, AlertCircle, RefreshCw, CheckCircle2, Plus, X } from "lucide-react";
import {CREATE_POLLING_UNIT} from "../graphql/mutations";
import {UPDATE_POLLING_UNIT_STATUS} from "../graphql/mutations";
import {GET_POLLING_UNITS} from "../graphql/queries";


export default function PollingUnits() {
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  
  // Modal toggle state and local form property storage
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", code: "", state: "", lga: "" });

  // Query Hook
  const { data, loading, error, refetch } = useQuery(GET_POLLING_UNITS, {
    fetchPolicy: "network-only",
  });

  // Status Update Mutation Hook
  const [updateStatus] = useMutation(UPDATE_POLLING_UNIT_STATUS, {
    onCompleted: () => {
      setUpdatingId(null);
      triggerSuccessToast("Status updated successfully!");
    },
    onError: (err) => {
      setUpdatingId(null);
      alert(`Update failed: ${err.message}`);
    }
  });

  // Creation Mutation Hook with automated UI Cache updating properties
  const [createPollingUnit, { loading: creating }] = useMutation(CREATE_POLLING_UNIT, {
    update(cache, { data: { createPollingUnit } }) {
      const existingData = cache.readQuery({ query: GET_POLLING_UNITS });
      if (existingData && createPollingUnit) {
        cache.writeQuery({
          query: GET_POLLING_UNITS,
          data: {
            getPollingUnits: [...existingData.getPollingUnits, createPollingUnit],
          },
        });
      }
    },
    onCompleted: () => {
      setIsModalOpen(false);
      setFormData({ name: "", code: "", state: "", lga: "" });
      triggerSuccessToast("New Polling Unit deployed successfully!");
    },
    onError: (err) => {
      alert(`Creation failed: ${err.message}`);
    }
  });

  const triggerSuccessToast = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    await updateStatus({
      variables: { id, status: newStatus },
      optimisticResponse: {
        __typename: "Mutation",
        updatePollingUnitStatus: { __typename: "PollingUnit", id, status: newStatus }
      }
    });
  };

  // Submission handler for deploying your creation endpoint mutations
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.state || !formData.lga) {
      alert("Please fulfill all unit structural inputs.");
      return;
    }
    await createPollingUnit({ variables: { ...formData } });
  };

  const pollingUnits = data?.getPollingUnits || [];

  const filteredUnits = pollingUnits.filter((unit) =>
    unit.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.lga?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status) => {
    const formattedStatus = status?.toUpperCase() || "UNKNOWN";
    switch (formattedStatus) {
      case "OPEN":
      case "ACTIVE":
        return "border-emerald-200 text-emerald-700 bg-emerald-50/40";
      case "CLOSED":
      case "PENDING":
        return "border-amber-200 text-amber-700 bg-amber-50/40";
      default:
        return "border-gray-200 text-gray-600 bg-gray-50/40";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Context Action Bar Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Polling Units</h1>
          <p className="text-sm text-gray-500 mt-1">
            Registered regional distribution nodes and state polling properties.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition"
          >
            <RefreshCw size={16} />
            Sync
          </button>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl shadow-md shadow-indigo-100 hover:bg-indigo-700 transition"
          >
            <Plus size={16} />
            New Polling Unit
          </button>
        </div>
      </div>

      {/* Action Toast Alert Notification Banner */}
      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium rounded-xl flex items-center gap-2">
          <CheckCircle2 size={18} className="text-emerald-600" />
          {successMessage}
        </div>
      )}

      {/* Utility Search Filtering Interface Container */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Filter by unit name, code, LGA, or state..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none shadow-sm"
        />
      </div>

      {/* Data Visual Table Layout Workspace */}
      {filteredUnits.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center mb-3">
            <MapPin size={22} />
          </div>
          <h3 className="text-sm font-bold text-gray-900">No polling units match</h3>
          <p className="text-xs text-gray-400 max-w-xs mt-1">We couldn't locate matching records.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
                  <th className="py-4 px-6">Unit Code</th>
                  <th className="py-4 px-6">Name / Placement Location</th>
                  <th className="py-4 px-6">LGA</th>
                  <th className="py-4 px-6">State</th>
                  <th className="py-4 px-6 text-right">Status Action Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm text-gray-600">
                {filteredUnits.map((unit) => (
                  <tr key={unit.id} className="hover:bg-gray-50/40 transition duration-150">
                    <td className="py-4 px-6 font-mono font-bold text-indigo-600">{unit.code || "N/A"}</td>
                    <td className="py-4 px-6 font-semibold text-gray-900 capitalize">{unit.name}</td>
                    <td className="py-4 px-6 text-gray-500 capitalize">{unit.lga || "—"}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 capitalize">
                        {unit.state || "—"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2 justify-end min-w-[140px]">
                        {updatingId === unit.id && <Loader2 size={14} className="animate-spin text-indigo-600" />}
                        <select
                          disabled={updatingId === unit.id}
                          value={unit.status || "UNKNOWN"}
                          onChange={(e) => handleStatusChange(unit.id, e.target.value)}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase ${getStatusStyle(unit.status)}`}
                        >
                          <option value="OPEN">Open</option>
                          <option value="CLOSED">Closed</option>
                          <option value="PENDING">Pending</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- POPUP FORM MODAL FRAMEWORK --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-100 animate-scale-in">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-base font-bold text-gray-900">Add New Polling Unit</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Unit Name</label>
                <input
                  type="text" required placeholder="e.g. Ubandoma"
                  value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Unit Code</label>
                <input
                  type="text" required placeholder="e.g. 04-12-03-001"
                  value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">LGA</label>
                  <input
                    type="text" required placeholder="e.g. Sabongari"
                    value={formData.lga} onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">State</label>
                  <input
                    type="text" required placeholder="e.g. Kaduna"
                    value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={creating}
                  className="flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition shadow-md shadow-indigo-100 disabled:opacity-50"
                >
                  {creating && <Loader2 size={14} className="animate-spin" />}
                  Deploy Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}