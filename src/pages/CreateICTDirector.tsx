import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Loader2, CheckCircle2, AlertCircle, UserCheck, MapPin } from 'lucide-react';

// 1. GraphQL Mutation perfectly tracking your explicit schema typeDefs
const CREATE_ICT_DIRECTOR_MUTATION = gql`
  mutation CreateICTDirector(
    $username: String!
    $password: String!
    $email: String
    $full_name: String!     # Mandatory (!) as defined in your Mutation inputs
    $state: String!        # Mandatory (!) as defined in your Mutation inputs
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
      email
      full_name
      state                # Now safe to query because it exists on your User model!
      role
    }
  }
`;

export default function CreateICTDirector() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    full_name: '',
    state: '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 2. Apollo v4 Hook Implementation for React 19 frameworks
  const [createDirector, { loading }] = useMutation(CREATE_ICT_DIRECTOR_MUTATION, {
    onCompleted: (data) => {
      const director = data.createICTDirector;
      setSuccessMessage(
        `Success! ${director.full_name} has been deployed as the ICT Director for ${director.state || 'assigned state'}.`
      );
      setErrorMessage(null);
      // Clear form inputs
      setFormData({ username: '', password: '', email: '', full_name: '', state: '' });
    },
    onError: (error) => {
      setErrorMessage(error.message);
      setSuccessMessage(null);
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

    // Client-side quick-validation block
    if (!formData.username || !formData.password || !formData.full_name || !formData.state) {
      setErrorMessage('Username, Password, Full Name, and Assigned State are required fields.');
      return;
    }

    await createDirector({
      variables: {
        username: formData.username,
        password: formData.password,
        full_name: formData.full_name,
        state: formData.state,
        email: formData.email || null, // Clean conversion to DB null types
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Provision ICT Director</h1>
        <p className="text-sm text-gray-500 mt-1">
          Deploy high-level command nodes with administrative regional system privileges.
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Status Message Alerts */}
          {errorMessage && (
            <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3" role="alert">
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
              <div>
                <span className="font-bold">System Refusal:</span> {errorMessage}
              </div>
            </div>
          )}

          {successMessage && (
            <div className="p-4 text-sm text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3" role="alert">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-emerald-600" />
              <div>
                <span className="font-bold">Execution Confirmed:</span> {successMessage}
              </div>
            </div>
          )}

          {/* Form Rows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Full Legal Name *</label>
              <input
                name="full_name" type="text" required value={formData.full_name} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition-all font-medium text-gray-800"
                placeholder="e.g. Umar Musa"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Official Email Address</label>
              <input
                name="email" type="email" value={formData.email} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition-all font-medium text-gray-800"
                placeholder="director@situationroom.gov"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Account Username *</label>
              <input
                name="username" type="text" required value={formData.username} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition-all font-semibold text-gray-900"
                placeholder="umar_director"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Secure Password Access *</label>
              <input
                name="password" type="password" required value={formData.password} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition-all font-mono text-gray-900"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Assigned State Jurisdiction *</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="state" type="text" required value={formData.state} onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm uppercase font-bold tracking-wide focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition-all text-gray-800"
                placeholder="e.g. BAUCHI, RIVERS, LAGOS"
              />
            </div>
          </div>

          <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl flex items-center justify-between text-xs font-medium text-indigo-800">
            <span className="flex items-center gap-2">
              <UserCheck size={15} className="text-indigo-600" />
              System Assigned Permission:
            </span>
            <span className="bg-indigo-600 text-white font-mono font-bold px-2 py-0.5 rounded text-[10px]">
              ICT_DIRECTOR
            </span>
          </div>

          <div className="pt-4 border-t border-gray-50 flex justify-end">
            <button
              type="submit" disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl shadow-md shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all duration-150"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'Authorizing Node Profile...' : 'Confirm and Deploy Director'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}