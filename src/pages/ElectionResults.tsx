import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Search, Loader2, AlertCircle, RefreshCw, User, FileText, Vote, Plus, X, CheckCircle2 } from "lucide-react";
import {SUBMIT_RESULT} from "../graphql/mutations";
import {GET_RESULTS} from "../graphql/queries";

export default function ElectionResults() {
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // Modal layout structural toggles & form properties
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ pollingUnit: "", candidate: "", votes: "" });

  // Query Data Stream
  const { data, loading, error, refetch } = useQuery(GET_RESULTS, {
    fetchPolicy: "network-only",
  });

  // Mutation Data Execution Hook with Automated Cache Updating properties
  const [submitResult, { loading: submitting }] = useMutation(SUBMIT_RESULT, {
    update(cache, { data: { submitResult } }) {
      const existingData = cache.readQuery({ query: GET_RESULTS });
      if (existingData && submitResult) {
        cache.writeQuery({
          query: GET_RESULTS,
          data: {
            getResults: [submitResult, ...existingData.getResults], // Inject new return at the top
          },
        });
      }
    },
    onCompleted: () => {
      setIsModalOpen(false);
      setFormData({ pollingUnit: "", candidate: "", votes: "" });
      triggerToastNotification("Election return sheets logged and recorded!");
    },
    onError: (err) => {
      alert(`Submission failed: ${err.message}`);
    }
  });

  const triggerToastNotification = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const voteInt = parseInt(formData.votes, 10);
    
    if (!formData.pollingUnit || !formData.candidate || isNaN(voteInt)) {
      alert("Please ensure all metrics structural inputs are typed accurately.");
      return;
    }

    await submitResult({
      variables: {
        pollingUnit: formData.pollingUnit,
        candidate: formData.candidate,
        votes: voteInt
      }
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
        <p className="text-sm font-medium text-gray-500">Compiling field results sheets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle size={20} />
          <span className="text-sm font-medium">Fetch Error: {error.message}</span>
        </div>
        <button 
          onClick={() => refetch()} 
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-red-200 rounded-lg shadow-sm hover:bg-red-50 transition"
        >
          <RefreshCw size={12} /> Retry
        </button>
      </div>
    );
  }

  const resultsList = data?.getResults || [];

  const filteredResults = resultsList.filter((result) => {
    const unit = result.pollingUnit?.toLowerCase() || "";
    const candidate = result.candidate?.toLowerCase() || "";
    const agentName = result.submittedBy?.full_name?.toLowerCase() || "";
    const agentUsername = result.submittedBy?.username?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();

    return unit.includes(term) || candidate.includes(term) || agentName.includes(term) || agentUsername.includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Header Context Action Bar Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Election Returns</h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time candidate score counts submitted by verified field monitors.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl shadow-md shadow-indigo-100 hover:bg-indigo-700 transition"
          >
            <Plus size={16} />
            Submit Result
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

      {/* Query Filter Control */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Filter by polling unit, candidate, or agent name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none shadow-sm"
        />
      </div>

      {/* Main Table Layout Workspace */}
      {filteredResults.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center mb-3">
            <FileText size={22} />
          </div>
          <h3 className="text-sm font-bold text-gray-900">No submission records found</h3>
          <p className="text-xs text-gray-400 max-w-xs mt-1">We couldn't locate matching returns.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
                  <th className="py-4 px-6">Polling Station Node</th>
                  <th className="py-4 px-6">Candidate / Flagbearer</th>
                  <th className="py-4 px-6">Total Votes Counted</th>
                  <th className="py-4 px-6">Submitted By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm text-gray-600">
                {filteredResults.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50/40 transition duration-150">
                    <td className="py-4 px-6 font-semibold text-gray-900 uppercase">{result.pollingUnit || "—"}</td>
                    <td className="py-4 px-6 font-medium text-gray-700 capitalize">{result.candidate || "—"}</td>
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-indigo-100/60 bg-indigo-50/40 text-xs font-bold text-indigo-700 font-mono">
                        <Vote size={14} />
                        {result.votes?.toLocaleString() ?? 0}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {result.submittedBy ? (
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                            <User size={14} className="text-gray-400" />
                            {result.submittedBy.full_name || result.submittedBy.username}
                          </div>
                          <div className="text-xs text-gray-400 pl-5">
                            {result.submittedBy.email} • <span className="text-indigo-500 font-bold text-[10px] tracking-wider uppercase">{result.submittedBy.role}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-xs">Unknown Submitter</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-gray-50/50 border-t border-gray-100 text-xs font-medium text-gray-400 text-right">
            Displaying {filteredResults.length} records entries
          </div>
        </div>
      )}

      {/* --- MODAL FORM INTERFACE OVERLAY --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-base font-bold text-gray-900">Submit New Sheet Return</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Polling Unit Code / Identifier</label>
                <input
                  type="text" required placeholder="e.g. PU-04-12-03"
                  value={formData.pollingUnit} onChange={(e) => setFormData({ ...formData, pollingUnit: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm uppercase font-semibold tracking-wider focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Candidate / Party Name</label>
                <input
                  type="text" required placeholder="e.g. APC, PDP, LP, NNPP"
                  value={formData.candidate} onChange={(e) => setFormData({ ...formData, candidate: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Total Votes Logged</label>
                <input
                  type="number" required min="0" placeholder="0"
                  value={formData.votes} onChange={(e) => setFormData({ ...formData, votes: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={submitting}
                  className="flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition shadow-md shadow-indigo-100 disabled:opacity-50"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  Submit Sheet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}