import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { CREATE_INCIDENT_MUTATION } from '../graphql/mutations';

export const CreateIncident = () => {
  const navigate = useNavigate();

  // 1. Local Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'TECHNICAL', // Example default category
    location: '',
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // 2. Apollo Mutation Hook
  const [createIncident, { loading }] = useMutation(CREATE_INCIDENT_MUTATION, {
    onCompleted: () => {
      setSuccessMessage('Incident logged successfully!');
      setErrorMessage(null);
      
      // Redirect back to dashboard or incident directory after a brief moment
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    },
    onError: (error) => {
      // Catches "Unauthorized" if the user's token is invalid or missing
      setErrorMessage(error.message);
      setSuccessMessage(null);
    },
  });

  // 3. Event Handlers
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category || !formData.location) {
      setErrorMessage('All fields are required to log an incident.');
      return;
    }

    await createIncident({
      variables: {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
      },
    });
  };

  // 4. Component Layout (Tailwind CSS)
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Report New Incident</h2>
        <p className="text-sm text-gray-500 mt-1">Please provide accurate details regarding the event.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Banner Alerts */}
        {errorMessage && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            {errorMessage === "Unauthorized" ? "Session expired. Please sign in again." : errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="p-3 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
            {successMessage}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Incident Title</label>
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., Server Room AC Outage"
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="VIOLENCE">VIOLENCE</option>
            <option value="VOTE_BUYING">VOTE_BUYING</option>
            <option value="INTIMIDATION">INTIMIDATION</option>
            <option value="RESULT_MANIPULATION">RESULT_MANIPULATION</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Location / Department</label>
          <input
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., 2nd Floor, West Wing"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Detailed Description</label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Describe what occurred, who was affected, and any actions taken..."
          />
        </div>

        {/* Submission Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 disabled:opacity-50 transition duration-150"
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>
    </div>
  );
};