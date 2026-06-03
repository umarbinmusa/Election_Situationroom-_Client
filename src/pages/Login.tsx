import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react'; // React 19 optimized subpath
import { useNavigate, Link } from 'react-router-dom';
import { LOGIN_MUTATION } from '../graphql/mutations'; 

export const Login: React.FC = () => {
  const navigate = useNavigate();

  // 1. Form Local State
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 2. Apollo Mutation Hook
  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      const { token } = data.login;

      // Persist the JWT token to localStorage for subsequent protected requests
      localStorage.setItem('token', token);
      setErrorMessage(null);

      // Navigate straight to the dashboard
      navigate('/dashboard');
      
      // Force a slight refresh if your global state depends directly on localStorage mounting
      window.location.reload(); 
    },
    onError: (error) => {
      // Captures "Invalid credentials" from your Argon2 verification backend
      setErrorMessage(error.message);
    },
  });

  // 3. Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    await login({
      variables: {
        username: formData.username,
        password: formData.password,
      },
    });
  };

  // 4. UI Layout (Tailwind CSS stylized to match your signup layout)
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg animate-fade-in" role="alert">
              {errorMessage}
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter your username"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 transition duration-150 ease-in-out"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>

       
      </div>
    </div>
  );
};