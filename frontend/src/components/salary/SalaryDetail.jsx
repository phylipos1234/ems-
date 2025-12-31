import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'
import { toast } from 'react-toastify'

const SalaryDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [salary, setSalary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSalary()
  }, [id])

  const fetchSalary = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axiosInstance.get(`/salary/${id}`)
      
      if (response.data.success) {
        setSalary(response.data.salary)
      }
    } catch (err) {
      console.error('Error fetching salary:', err)
      setError(
        err.response?.data?.message || 'Failed to load salary. Please try again.'
      )
      toast.error('Failed to load salary details', {
        position: 'top-right',
        autoClose: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0)
  }

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Calculate net salary
  const calculateNetSalary = () => {
    if (!salary) return 0
    const basic = salary.basicSalary || 0
    const allowance = salary.allowance || 0
    const deduction = salary.deduction || 0
    return basic + allowance - deduction
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 rounded shadow">
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-600 text-sm sm:text-base">Loading salary details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 rounded shadow">
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded mb-4 text-sm sm:text-base">
          {error}
        </div>
        <div className="text-center">
          <button
            onClick={() => navigate('/admin-dashboard/salary')}
            className="px-4 py-2 text-sm sm:text-base bg-teal-600 text-white rounded hover:bg-teal-700 transition"
          >
            Back to Salaries
          </button>
        </div>
      </div>
    )
  }

  if (!salary) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 rounded shadow">
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-600 text-sm sm:text-base">Salary not found.</p>
          <button
            onClick={() => navigate('/admin-dashboard/salary')}
            className="mt-4 px-4 py-2 text-sm sm:text-base bg-teal-600 text-white rounded hover:bg-teal-700 transition"
          >
            Back to Salaries
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Salary Details</h2>
          <Link
            to="/admin-dashboard/salary"
            className="text-sm sm:text-base text-gray-600 hover:text-gray-800 transition"
          >
            ← Back to List
          </Link>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Salary Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-4 sm:px-6 md:px-8 py-4 sm:py-6">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
            {salary.employee?.name || 'Employee Salary'}
          </h3>
          <p className="text-sm sm:text-base text-teal-100 mt-1">
            {salary.department?.departmentName || 'No department assigned'}
          </p>
        </div>

        {/* Details Section */}
        <div className="p-4 sm:p-6 md:p-8">
          <div className="space-y-6">
            {/* Salary Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employee */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Employee
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-800">{salary.employee?.name || 'N/A'}</p>
                  {salary.employee?.employeeId && (
                    <p className="text-sm text-gray-600 mt-1">ID: {salary.employee.employeeId}</p>
                  )}
                  {salary.employee?.email && (
                    <p className="text-sm text-gray-600 mt-1">{salary.employee.email}</p>
                  )}
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Department
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-800">
                    {salary.department?.departmentName || 'No department assigned'}
                  </p>
                </div>
              </div>

              {/* Basic Salary */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Basic Salary
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-800 text-lg font-semibold">
                    {formatCurrency(salary.basicSalary)}
                  </p>
                </div>
              </div>

              {/* Allowance */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Allowance
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(salary.allowance)}
                  </p>
                </div>
              </div>

              {/* Deduction */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Deduction
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-lg font-semibold text-red-600">
                    {formatCurrency(salary.deduction)}
                  </p>
                </div>
              </div>

              {/* Net Salary */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Net Salary
                </label>
                <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-4">
                  <p className="text-teal-700 text-xl font-bold">
                    {formatCurrency(calculateNetSalary())}
                  </p>
                </div>
              </div>

              {/* Pay Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Pay Date
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-800">
                    {formatDate(salary.payDate)}
                  </p>
                </div>
              </div>

              {/* Salary ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Salary ID
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-800 font-mono text-sm">{salary._id}</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  Created: {new Date(salary.createdAt).toLocaleDateString('en-US', {
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
              onClick={() => navigate('/admin-dashboard/salary')}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Back to List
            </button>
            <Link
              to={`/admin-dashboard/edit-salary/${salary._id}`}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base bg-teal-600 text-white rounded hover:bg-teal-700 transition text-center"
            >
              Edit Salary
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalaryDetail