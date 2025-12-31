import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/employee/${id}`);
      
      if (response.data.success) {
        setEmployee(response.data.employee);
      }
    } catch (err) {
      console.error("Error fetching employee:", err);
      setError(
        err.response?.data?.message || "Failed to load employee. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 rounded shadow">
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-600 text-sm sm:text-base">Loading employee details...</p>
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
            onClick={() => navigate("/admin-dashboard/employees")}
            className="px-4 py-2 text-sm sm:text-base bg-teal-600 text-white rounded hover:bg-teal-700 transition"
          >
            Back to Employees
          </button>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 rounded shadow">
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-600 text-sm sm:text-base">Employee not found.</p>
          <button
            onClick={() => navigate("/admin-dashboard/employees")}
            className="mt-4 px-4 py-2 text-sm sm:text-base bg-teal-600 text-white rounded hover:bg-teal-700 transition"
          >
            Back to Employees
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
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Employee Details</h2>
          <Link
            to="/admin-dashboard/employees"
            className="text-sm sm:text-base text-gray-600 hover:text-gray-800 transition"
          >
            ← Back to List
          </Link>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Employee Name Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-4 sm:px-6 md:px-8 py-4 sm:py-6">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">{employee.name}</h3>
          <p className="text-sm sm:text-base text-teal-100 mt-1">{employee.position || 'No position assigned'}</p>
        </div>

        {/* Details Section */}
        <div className="p-4 sm:p-6 md:p-8">
          <div className="space-y-6">
            {/* Basic Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Email
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-800">{employee.email}</p>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Phone
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-800">{employee.phone || 'N/A'}</p>
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Department
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-800">
                    {employee.department?.departmentName || 'No department assigned'}
                  </p>
                </div>
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Position
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-800">{employee.position || 'N/A'}</p>
                </div>
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Salary
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-800">
                    {employee.salary ? `$${employee.salary.toLocaleString()}` : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Status
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                    employee.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : employee.status === 'on-leave'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {employee.status || 'active'}
                  </span>
                </div>
              </div>

              {/* Hire Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Hire Date
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-800">
                    {employee.hireDate 
                      ? new Date(employee.hireDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Employee ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Employee ID
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-800 font-mono text-sm">{employee._id}</p>
                </div>
              </div>
            </div>

            {/* Address */}
            {employee.address && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Address
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-800 whitespace-pre-wrap">{employee.address}</p>
                </div>
              </div>
            )}

            {/* Department Description if available */}
            {employee.department?.description && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Department Description
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-800">{employee.department.description}</p>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  Created: {new Date(employee.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <button
              onClick={() => navigate("/admin-dashboard/employees")}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Back to List
            </button>
            <Link
              to={`/admin-dashboard/edit-employee/${employee._id}`}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base bg-teal-600 text-white rounded hover:bg-teal-700 transition text-center"
            >
              Edit Employee
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;

