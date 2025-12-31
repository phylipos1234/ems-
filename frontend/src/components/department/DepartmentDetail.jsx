import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const DepartmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDepartment();
  }, [id]);

  const fetchDepartment = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/department/${id}`);
      
      if (response.data.success) {
        setDepartment(response.data.department);
      }
    } catch (err) {
      console.error("Error fetching department:", err);
      setError(
        err.response?.data?.message || "Failed to load department. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 rounded shadow">
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-600 text-sm sm:text-base">Loading department details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 rounded shadow">
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded mb-4 text-sm sm:text-base">
          {error}
        </div>
        <div className="text-center">
          <button
            onClick={() => navigate("/admin-dashboard/departments")}
            className="px-4 py-2 text-sm sm:text-base bg-teal-600 text-white rounded hover:bg-teal-700 transition"
          >
            Back to Departments
          </button>
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 rounded shadow">
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-600 text-sm sm:text-base">Department not found.</p>
          <button
            onClick={() => navigate("/admin-dashboard/departments")}
            className="mt-4 px-4 py-2 text-sm sm:text-base bg-teal-600 text-white rounded hover:bg-teal-700 transition"
          >
            Back to Departments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Department Details</h2>
          <Link
            to="/admin-dashboard/departments"
            className="text-sm sm:text-base text-gray-600 hover:text-gray-800 transition"
          >
            ← Back to List
          </Link>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Department Name Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-4 sm:px-6 md:px-8 py-4 sm:py-6">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">{department.departmentName}</h3>
        </div>

        {/* Details Section */}
        <div className="p-4 sm:p-6 md:p-8">
          <div className="space-y-6">
            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Description
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {department.description}
                </p>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Department ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Department ID
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-800 font-mono text-sm">{department._id}</p>
                </div>
              </div>

              {/* Created Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Created At
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-800">
                    {new Date(department.createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Last updated: {new Date(department.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <button
              onClick={() => navigate("/admin-dashboard/departments")}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Back to List
            </button>
            <Link
              to={`/admin-dashboard/edit-department/${department._id}`}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base bg-teal-600 text-white rounded hover:bg-teal-700 transition text-center"
            >
              Edit Department
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetail;

