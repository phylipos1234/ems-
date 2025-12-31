import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'
import { toast } from 'react-toastify'
import EditSalary from './EditSalary'

const SalaryList = ({ refreshTrigger }) => {
  const navigate = useNavigate()
  const [salaries, setSalaries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedSalary, setSelectedSalary] = useState(null)

  // Fetch salaries
  const fetchSalaries = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axiosInstance.get('/salary')
      if (response.data.success) {
        setSalaries(response.data.salaries || [])
      }
    } catch (err) {
      console.error('Error fetching salaries:', err)
      setError('Failed to load salaries. Please try again.')
      toast.error('Failed to load salaries', {
        position: 'top-right',
        autoClose: 3000,
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSalaries()
  }, [fetchSalaries, refreshTrigger])

  // Delete salary
  const handleDelete = async (id, employeeName) => {
    if (!window.confirm(`Are you sure you want to delete the salary record for "${employeeName}"? This action cannot be undone.`)) {
      return
    }

    try {
      setDeleteLoading(id)
      const response = await axiosInstance.delete(`/salary/${id}`)
      if (response.data.success) {
        toast.success('Salary deleted successfully!', {
          position: 'top-right',
          autoClose: 3000,
        })
        fetchSalaries()
      }
    } catch (err) {
      console.error('Error deleting salary:', err)
      const errorMessage = err.response?.data?.message || 'Failed to delete salary. Please try again.'
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      })
    } finally {
      setDeleteLoading(null)
    }
  }

  // Handle edit
  const handleEdit = (salary) => {
    setSelectedSalary(salary)
    setEditModalOpen(true)
  }

  const handleEditClose = () => {
    setEditModalOpen(false)
    setSelectedSalary(null)
  }

  const handleEditSuccess = () => {
    fetchSalaries()
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
      month: 'short',
      day: 'numeric',
    })
  }

  // Calculate net salary
  const calculateNetSalary = (salary) => {
    const basic = salary.basicSalary || 0
    const allowance = salary.allowance || 0
    const deduction = salary.deduction || 0
    return basic + allowance - deduction
  }

  return (
    <div>
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading salaries...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : salaries.length === 0 ? (
        <div className="bg-white rounded shadow p-6 text-center">
          <p className="text-gray-600">No salary records found. Add your first salary record!</p>
        </div>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Basic Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Allowance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deduction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pay Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salaries.map((salary) => (
                  <tr key={salary._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* <div className="text-sm font-medium text-gray-900">
                        {salary.employee?.name || 'N/A'}
                      </div> */}
                      {salary.employee?.employeeId && (
                        <div className="text-sm text-gray-500">
                          ID: {salary.employee.employeeId}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {salary.department?.departmentName || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(salary.basicSalary)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(salary.allowance)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-red-600">
                        {formatCurrency(salary.deduction)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-teal-600">
                        {formatCurrency(calculateNetSalary(salary))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(salary.payDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/admin-dashboard/salary/${salary._id}`)}
                          className="text-blue-600 hover:text-blue-900 transition"
                          title="View Details"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(salary)}
                          className="text-teal-600 hover:text-teal-900 transition"
                          title="Edit Salary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(salary._id, salary.employee?.name || 'this salary')}
                          disabled={deleteLoading === salary._id}
                          className={`text-red-600 hover:text-red-900 transition ${
                            deleteLoading === salary._id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title="Delete Salary"
                        >
                          {deleteLoading === salary._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && !error && salaries.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Showing {salaries.length} salary record(s)
        </div>
      )}

      {/* Edit Salary Modal */}
      {selectedSalary && (
        <EditSalary
          isOpen={editModalOpen}
          onClose={handleEditClose}
          onSuccess={handleEditSuccess}
          salary={selectedSalary}
        />
      )}
    </div>
  )
}

export default SalaryList

