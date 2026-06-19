import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  MapPin,
} from "lucide-react";
import {CREATE_POLLING_UNIT_OFFICER_MUTATION} from "../graphql/mutations";

// GraphQL Mutation mapped directly to your backend args schema object payload
export default function CreatePollingUnitOfficer() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    full_name: "",
    email: "",
    pollingUnit: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [createOfficer, { loading }] = useMutation(CREATE_POLLING_UNIT_OFFICER_MUTATION, {
    onCompleted: (data) => {
      const officer = data.createPollingUnitOfficer;
      setSuccessMessage(
        `Officer ${officer.full_name} successfully registered to Polling Unit: ${officer.pollingUnit} (${officer.ward} Ward).`
      );
      setErrorMessage("");

      // Flush fields to prevent data duplication
      setFormData({
        username: "",
        password: "",
        full_name: "",
        email: "",
        pollingUnit: "",
      });
    },
    onError: (error) => {
      setSuccessMessage("");
      setErrorMessage(error.message);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const username = formData.username.trim();
    const password = formData.password.trim();
    const full_name = formData.full_name.trim();
    const pollingUnit = formData.pollingUnit.trim().toUpperCase(); // Keeps structural data capitalized uniformly
    const email = formData.email.trim() || null;

    if (!username || !password || !full_name || !pollingUnit) {
      setErrorMessage("Username, Password, Full Name, and Polling Unit details are required.");
      return;
    }

    await createOfficer({
      variables: {
        username,
        password,
        full_name,
        pollingUnit,
        email,
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow border p-6">
        <h1 className="text-2xl font-bold mb-2">Create Polling Unit Officer</h1>
        <p className="text-gray-500 mb-6">Provision a new ground field-agent credential for a designated Polling Unit.</p>

        {/* Diagnostic Status Alerts */}
        {errorMessage && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 text-sm font-medium">
            <AlertCircle size={18} className="shrink-0" />
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-green-700 text-sm font-medium">
            <CheckCircle2 size={18} className="shrink-0" />
            {successMessage}
          </div>
        )}

        {/* Input Interface Field Blocks */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="Chidi Okafor"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="officer.field@example.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="pu_001_agent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="********"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Polling Unit Code / Description</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="pollingUnit"
                value={formData.pollingUnit}
                onChange={handleChange}
                className="w-full border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="PU: 19/15/04/002 - OPEN SPACE PRIM. SCH."
              />
            </div>
          </div>

          {/* Core Clearance Inheritance Context Card */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3.5 flex justify-between items-center">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-indigo-700 text-sm font-semibold">
                <UserCheck size={16} />
                Auto-Inherited Demographics
              </div>
              <p className="text-[11px] text-indigo-500 font-medium mt-0.5">
                Locks down this officer to your active State, LGA, and Ward location boundaries automatically.
              </p>
            </div>
            <span className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide shadow-sm shrink-0">
              PU_OFFICER
            </span>
          </div>

          {/* Submission Control Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white rounded-lg py-3 font-semibold hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-sm shadow-indigo-100"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Creating Ground Agent Account..." : "Create Polling Unit Officer"}
          </button>
        </form>
      </div>
    </div>
  );
}