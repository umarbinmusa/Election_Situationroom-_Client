import React from "react";
import { useQuery } from "@apollo/client/react";
import { Award, Users, BarChart3, Loader2, AlertCircle, RefreshCw, Trophy } from "lucide-react";
import {GET_ELECTION_SUMMARY} from "../graphql/queries";

// 1. Define the GraphQL query matching your aggregation output

export default function ElectionSummaryDashboard() {
  const { data, loading, error, refetch } = useQuery(GET_ELECTION_SUMMARY, {
    fetchPolicy: "network-only", // Ensures live tally metrics match the DB instantly
    pollInterval: 10000,         // Optional: Automatically updates data every 10 seconds
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
        <p className="text-sm font-medium text-gray-500">Aggregating live election summaries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle size={20} />
          <span className="text-sm font-medium">Calculation error: {error.message}</span>
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

  const { winner, totalVotes, results = [] } = data?.electionSummary || {};

  // Calculate overall grand total votes across ALL candidates combined
  const grandTotalVotes = results.reduce((acc, curr) => acc + curr.totalVotes, 0);

  return (
    <div className="space-y-8">
      {/* Header Context Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Election Summary</h1>
          <p className="text-sm text-gray-500 mt-1">
            Aggregated leaderboards and cumulative live scoring tallies.
          </p>
        </div>
        
        <button
          onClick={() => refetch()}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition"
        >
          <RefreshCw size={16} />
          Sync Tallies
        </button>
      </div>

      {/* Overview Metric Node Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Leading Candidate Node */}
        <div className="p-6 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-2xl shadow-md relative overflow-hidden">
          <div className="space-y-1 relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200/90 block">
              Current Pacemaker
            </span>
            <h2 className="text-2xl font-black tracking-tight capitalize truncate">
              {winner || "No Data Yet"}
            </h2>
            <p className="text-xs text-indigo-100/80 pt-2 font-medium">
              Leading with <span className="font-mono font-bold text-white">{totalVotes.toLocaleString()}</span> votes
            </p>
          </div>
          <Trophy size={80} className="absolute -right-4 -bottom-4 text-indigo-500/30 rotate-12" />
        </div>

        {/* Grand Total Combined Votes Cast */}
        <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
              Cumulative Turnout
            </span>
            <span className="text-3xl font-black text-gray-900 tracking-tight font-mono block">
              {grandTotalVotes.toLocaleString()}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 text-gray-500 shrink-0">
            <Users size={22} />
          </div>
        </div>

        {/* Unique Flagbearers Engaged */}
        <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
              Active Candidates
            </span>
            <span className="text-3xl font-black text-gray-900 tracking-tight font-mono block">
              {results.length}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 text-gray-500 shrink-0">
            <BarChart3 size={22} />
          </div>
        </div>
      </div>

      {/* Visual Leaderboard Stack Layout */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Flagbearer Standings</h3>
          <p className="text-xs text-gray-400 mt-0.5">Ranked scale based on cumulative field transaction weights.</p>
        </div>

        {results.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6 italic">Waiting on verified sheet submission records...</p>
        ) : (
          <div className="space-y-5">
            {results.map((result, index) => {
              // Calculate specific percentage slice relative to the whole database turnout
              const percentage = grandTotalVotes > 0 
                ? ((result.totalVotes / grandTotalVotes) * 100).toFixed(1) 
                : 0;

              return (
                <div key={result.candidate} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {/* Rank Index Badging */}
                      <span className={`w-5 h-5 rounded text-[10px] font-extrabold flex items-center justify-center ${
                        index === 0 ? "bg-amber-100 text-amber-800" :
                        index === 1 ? "bg-slate-100 text-slate-700" :
                        "bg-gray-50 text-gray-400"
                      }`}>
                        {index + 1}
                      </span>
                      <span className="font-bold text-gray-800 capitalize">{result.candidate}</span>
                    </div>
                    
                    <div className="text-right font-mono text-xs text-gray-500">
                      <span className="font-bold text-gray-900">{result.totalVotes.toLocaleString()}</span> ({percentage}%)
                    </div>
                  </div>

                  {/* Tailored Progress Bar Frame */}
                  <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ease-out ${
                        index === 0 ? "bg-indigo-600" : "bg-indigo-400/60"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}