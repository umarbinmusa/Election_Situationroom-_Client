import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_INCIDENTS_QUERY } from "../graphql/queries";

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
  createdAt: string;
}

interface QueryData {
  getIncidents: IncidentPayload[];
}

const IncidentDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const incidentId = location.state?.incidentId;

  const { loading, error, data } =
    useQuery<QueryData>(GET_INCIDENTS_QUERY);

  if (!incidentId) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="font-bold text-yellow-700">
            No Incident Selected
          </h2>

          <p className="text-sm text-yellow-600 mt-2">
            Please select an incident from the dashboard.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full mb-4" />
        <p className="text-gray-500">
          Loading incident details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          <h2 className="font-bold">Error</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  const incident = data?.getIncidents.find(
    (item) => item.id === incidentId
  );

  if (!incident) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="font-bold text-red-700">
            Incident Not Found
          </h2>

          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
      >
        ← Back
      </button>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {incident.title}
            </h1>

            <p className="text-gray-500 mt-2">
              Incident ID: {incident.id}
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              incident.status === "PENDING"
                ? "bg-red-100 text-red-700"
                : incident.status === "VERIFIED"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {incident.status}
          </span>
        </div>

        <div className="grid gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Description
            </h3>

            <p className="text-gray-600">
              {incident.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">
                Category
              </h4>

              <p>{incident.category}</p>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">
                Location
              </h4>

              <p>{incident.location}</p>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">
                Reported By
              </h4>

              <p>
                {incident.reportedBy?.username ||
                  "Anonymous Client"}
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">
                Created At
              </h4>

              <p>
                {new Date(
                  Number(incident.createdAt)
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetails;