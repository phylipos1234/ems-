import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'

const EmployeeList = () => {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [imageErrors, setImageErrors] = useState(new Set())

  // Fetch employees
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axiosInstance.get('/employee')
      if (response.data.success) {
        setEmployees(response.data.employees)
      }
    } catch (err) {
      console.error('Error fetching employees:', err)
      setError('Failed to load employees. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  // Delete employee
  const handleDelete = async (id, employeeName) => {
    if (!window.confirm(`Are you sure you want to delete "${employeeName}"? This action cannot be undone.`)) {
      return
    }

    try {
      setDeleteLoading(id)
      const response = await axiosInstance.delete(`/employee/${id}`)
      if (response.data.success) {
        fetchEmployees()
      }
    } catch (err) {
      console.error('Error deleting employee:', err)
      alert(err.response?.data?.message || 'Failed to delete employee. Please try again.')
    } finally {
      setDeleteLoading(null)
    }
  }

  // Filter employees based on search term
  const filteredEmployees = employees.filter(emp =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='p-5'>
      <div className='text-center mb-6'>
        <h3 className='text-2xl font-bold'>Manage Employees</h3>
      </div>
      
      <div className='flex justify-between items-center mb-6'>
        <input 
          type="text" 
          placeholder="Search By Name, Email, Position, or Employee ID" 
          className='flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link 
          to="/admin-dashboard/add-employees" 
          className="ml-4 px-4 py-2 bg-teal-600 rounded text-white hover:bg-teal-700 transition"
        >
          Add New Employee
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading employees...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="bg-white rounded shadow p-6 text-center">
          <p className="text-gray-600">
            {searchTerm ? 'No employees found matching your search.' : 'No employees found. Add your first employee!'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Photo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hire Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => {
                  const imageUrl = employee.profileImage 
                    ? `http://localhost:5000${employee.profileImage}`
                    : null;
                  const hasImageError = imageErrors.has(employee._id);
                  const showImage = imageUrl && !hasImageError;
                  
                  return (
                  <tr key={employee._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {showImage ? (
                          <img
                            src={imageUrl}
                            alt={employee.name}
                            className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                            onError={() => {
                              setImageErrors(prev => new Set(prev).add(employee._id));
                            }}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-semibold">
                            {employee.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/admin-dashboard/employee/${employee._id}`)}
                        className="text-sm font-medium text-teal-600 hover:text-teal-900 transition cursor-pointer"
                      >
                        {employee.name}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{employee.employeeId || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{employee.position || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {employee.department?.departmentName || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{employee.phone || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {employee.salary ? `$${employee.salary.toLocaleString()}` : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        employee.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : employee.status === 'on-leave'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {employee.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/admin-dashboard/employee/${employee._id}`)}
                          className="text-blue-600 hover:text-blue-900 transition"
                          title="View Details"
                        >
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/admin-dashboard/edit-employee/${employee._id}`)}
                          className="text-teal-600 hover:text-teal-900 transition"
                          title="Edit Employee"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => navigate('/admin-dashboard/Salary')}
                          className="text-purple-600 hover:text-purple-900 transition"
                          title="View Salary"
                        >
                          Salary
                        </button>
                        <button
                          onClick={() => handleDelete(employee._id, employee.name)}
                          disabled={deleteLoading === employee._id}
                          className={`text-red-600 hover:text-red-900 transition ${
                            deleteLoading === employee._id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title="Delete Employee"
                        >
                          {deleteLoading === employee._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && !error && employees.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredEmployees.length} of {employees.length} employee(s)
        </div>
      )}
    </div>
  )
}

export default EmployeeList

