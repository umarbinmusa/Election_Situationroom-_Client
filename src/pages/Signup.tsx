import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react'; 
import { gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom'; 
import { SIGNUP_MUTATION } from '../graphql/mutations';
import { UserPlus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SignupFormProps {
  onSuccessClose?: () => void; // Ideal for shutting down a drawer or panel on complete
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSuccessClose }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    full_name: '',
    role: 'COORDINATOR', // Adjusted to match your situational defaults
  });
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [signup, { loading }] = useMutation(SIGNUP_MUTATION, {
    onCompleted: (data) => {
      const { token, user } = data.signup;
      localStorage.setItem('token', token);
      
      setSuccessMessage(`Account created for ${user.full_name || user.username}!`);
      setErrorMessage(null);
      
      setTimeout(() => {
        if (onSuccessClose) onSuccessClose();
        navigate('/dashboard');
      }, 1500);
    },
    onError: (error) => {
      setErrorMessage(error.message);
      setSuccessMessage(null);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.role) {
      setErrorMessage('Username, Password, and Role are required.');
      return;
    }

    await signup({
      variables: {
        username: formData.username,
        password: formData.password,
        role: formData.role,
        email: formData.email || null,
        full_name: formData.full_name || null,
      },
    });
  };

  return (
    <div className="w-full bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <UserPlus size={16} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">Provision New User</h3>
          <p className="text-[11px] text-gray-400">Register administrative or field personnel nodes.</p>
        </div>
      </div>
      
      <form className="space-y-3.5" onSubmit={handleSubmit}>
        {/* State Banner Notifications */}
        {errorMessage && (
          <div className="p-2.5 text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2" role="alert">
            <AlertCircle size={14} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="p-2.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-2" role="alert">
            <CheckCircle2 size={14} className="shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
          <input
            name="full_name" type="text" value={formData.full_name} onChange={handleChange}
            className="block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
          <input
            name="email" type="email" value={formData.email} onChange={handleChange}
            className="block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition"
            placeholder="name@example.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Username *</label>
            <input
              name="username" type="text" required value={formData.username} onChange={handleChange}
              className="block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition"
              placeholder="user123"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Password *</label>
            <input
              name="password" type="password" required value={formData.password} onChange={handleChange}
              className="block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">System Role Allocation *</label>
          <select
            name="role" value={formData.role} onChange={handleChange}
            className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 font-medium focus:border-indigo-500 outline-none cursor-pointer transition"
          >
            <option value="COORDINATOR">COORDINATOR</option>
            <option value="ADMIN">ADMIN</option>
            <option value="OBSERVER">OBSERVER</option>
            <option value="SECURITY">SECURITY</option>
            <option value="ANALYST">ANALYST</option>
            <option value="MEDIA">MEDIA</option>
          </select>
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full flex justify-center items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 disabled:opacity-50 transition duration-150"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : null}
          {loading ? 'Registering Node...' : 'Deploy Account'}
        </button>
      </form>
    </div>
  );
};