import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { gql } from '@apollo/client';
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  MapPin,
} from "lucide-react";

const CREATE_ICT_DIRECTOR_MUTATION = gql`
  mutation CreateICTDirector(
    $username: String!
    $password: String!
    $email: String
    $full_name: String!
    $state: String!
  ) {
    createICTDirector(
      username: $username
      password: $password
      email: $email
      full_name: $full_name
      state: $state
    ) {
      id
      username
      full_name
      email
      role
      state
    }
  }
`;

export default function CreateICTDirector() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    full_name: "",
    email: "",
    state: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [createDirector, { loading }] = useMutation(CREATE_ICT_DIRECTOR_MUTATION, {
    onCompleted: (data) => {
      console.log("Response data received:", data);

      setSuccessMessage(
        `ICT Director ${data.createICTDirector.full_name} created successfully for ${data.createICTDirector.state}`
      );
      setErrorMessage("");

      setFormData({
        username: "",
        password: "",
        full_name: "",
        email: "",
        state: "",
      });
    },
    onError: (error) => {
      console.error("Mutation Error intercepted:", error);
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
    const state = formData.state.trim().toUpperCase();
    const email = formData.email.trim() || null;

    if (!username || !password || !full_name || !state) {
      setErrorMessage("Username, Password, Full Name and State are required.");
      return;
    }

    console.log("Submitting variables payload:", {
      username,
      password,
      full_name,
      state,
      email,
    });

    await createDirector({
      variables: {
        username,
        password,
        full_name,
        state,
        email,
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow border p-6">
        <h1 className="text-2xl font-bold mb-2">Create ICT Director</h1>
        <p className="text-gray-500 mb-6">Create a State ICT Director account.</p>

        {errorMessage && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
            <AlertCircle size={18} />
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-green-700">
            <CheckCircle2 size={18} />
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Umar Musa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="director@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="state_director"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="********"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full border rounded-lg pl-10 pr-4 py-2"
                placeholder="KADUNA"
              />
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex justify-between items-center">
            <div className="flex items-center gap-2 text-indigo-700">
              <UserCheck size={16} />
              Assigned Role
            </div>
            <span className="bg-indigo-600 text-white px-3 py-1 rounded text-xs font-semibold">
              ICT_DIRECTOR
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white rounded-lg py-3 font-semibold hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Creating Director..." : "Create ICT Director"}
          </button>
        </form>
      </div>
    </div>
  );
}