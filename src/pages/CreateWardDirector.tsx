import React, { useState } from "react";
import { useMutation} from "@apollo/client/react";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Layers,
} from "lucide-react";

import {CREATE_WARD_DIRECTOR_MUTATION} from "../graphql/mutations";

export default function CreateWardDirector() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    full_name: "",
    email: "",
    ward: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [createWardDirector, { loading }] = useMutation(CREATE_WARD_DIRECTOR_MUTATION, {
    onCompleted: (data) => {
      const director = data.createWardDirector;
      setSuccessMessage(
        `Ward Director ${director.full_name} successfully registered for Ward: ${director.ward} (${director.lga} Local Government).`
      );
      setErrorMessage("");

      // Flush form inputs on successful mutation save
      setFormData({
        username: "",
        password: "",
        full_name: "",
        email: "",
        ward: "",
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
    const ward = formData.ward.trim().toUpperCase(); // Capitalizing registration data safely
    const email = formData.email.trim() || null;

    if (!username || !password || !full_name || !ward) {
      setErrorMessage("Username, Password, Full Name, and Ward Name are required fields.");
      return;
    }

    await createWardDirector({
      variables: {
        username,
        password,
        full_name,
        ward,
        email,
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow border p-6">
        <h1 className="text-2xl font-bold mb-2">Create Ward Director</h1>
        <p className="text-gray-500 mb-6">Provision a new Ward ICT Director account for field reporting.</p>

        {/* Message Banner Alerts */}
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

        {/* Form Elements layout matches structural styles across components */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="Mal. Aminu Kano"
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
              placeholder="ward.director@example.com"
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
                placeholder="sabongari_ward_admin"
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
            <label className="block text-sm font-medium mb-1 text-gray-700">Ward Identification Name</label>
            <div className="relative">
              <Layers size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="ward"
                value={formData.ward}
                onChange={handleChange}
                className="w-full border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="SABON GARI EAST"
              />
            </div>
          </div>

          {/* Context Banner indicating auto-inheritance fields from parent context token info */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3.5 flex justify-between items-center">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-indigo-700 text-sm font-semibold">
                <UserCheck size={16} />
                Regional Clearance Levels
              </div>
              <p className="text-[11px] text-indigo-500 font-medium mt-0.5">
                Automatically locked and assigned to your current state and local government boundary.
              </p>
            </div>
            <span className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide shadow-sm shrink-0">
              WARD_ICT_DIRECTOR
            </span>
          </div>

          {/* Call-to-action Action Switch */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white rounded-lg py-3 font-semibold hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-sm shadow-indigo-100"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Registering Ward Administrator..." : "Create Ward Director Account"}
          </button>
        </form>
      </div>
    </div>
  );
}