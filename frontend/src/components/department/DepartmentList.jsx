import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'
import { toast } from 'react-toastify'
import axiosInstance from '../../api/axiosInstance'

const DepartmentList = () => {
  const navigate = useNavigate()
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [globalFilter, setGlobalFilter] = useState('')
  const [error, setError] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(null)

  // Fetch departments
  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axiosInstance.get('/department')
      if (response.data.success) {
        setDepartments(response.data.departments)
      }
    } catch (err) {
      console.error('Error fetching departments:', err)
      setError('Failed to load departments. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDepartments()
  }, [fetchDepartments])

  // Delete department
  const handleDelete = useCallback(async (id, departmentName) => {
    if (!window.confirm(`Are you sure you want to delete "${departmentName}"? This action cannot be undone.`)) {
      return
    }

    try {
      setDeleteLoading(id)
      const response = await axiosInstance.delete(`/department/${id}`)
      if (response.data.success) {
        // Show success toast
        toast.success(`Department "${departmentName}" deleted successfully!`, {
          position: "top-right",
          autoClose: 3000,
        })
        // Refresh the list
        fetchDepartments()
      }
    } catch (err) {
      console.error('Error deleting department:', err)
      toast.error(err.response?.data?.message || 'Failed to delete department. Please try again.', {
        position: "top-right",
        autoClose: 3000,
      })
    } finally {
      setDeleteLoading(null)
    }
  }, [fetchDepartments])

  // Navigate to edit page
  const handleEdit = useCallback((id) => {
    navigate(`/admin-dashboard/edit-department/${id}`)
  }, [navigate])

  // Define columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'departmentName',
        header: 'Department Name',
        cell: ({ row }) => (
          <button
            onClick={() => navigate(`/admin-dashboard/department/${row.original._id}`)}
            className="text-sm font-medium text-teal-600 hover:text-teal-900 transition cursor-pointer"
          >
            {row.getValue('departmentName')}
          </button>
        ),
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => (
          <div className="text-sm text-gray-500 max-w-md">
            {row.getValue('description')}
          </div>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Created At',
        cell: ({ row }) => (
          <div className="text-sm text-gray-500">
            {new Date(row.getValue('createdAt')).toLocaleDateString()}
          </div>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(`/admin-dashboard/department/${row.original._id}`)}
              className="text-blue-600 hover:text-blue-900 transition"
              title="View Details"
            >
              View
            </button>
            <button
              onClick={() => handleEdit(row.original._id)}
              className="text-teal-600 hover:text-teal-900 transition"
              title="Edit Department"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(row.original._id, row.original.departmentName)}
              disabled={deleteLoading === row.original._id}
              className={`text-red-600 hover:text-red-900 transition ${
                deleteLoading === row.original._id ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Delete Department"
            >
              {deleteLoading === row.original._id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        ),
      },
    ],
    [navigate, deleteLoading, handleDelete, handleEdit]
  )

  // Create table instance
  const table = useReactTable({
    data: departments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  })

  return (
    <div className='p-3 sm:p-4 md:p-5'>
      <div className='text-center mb-4 sm:mb-6'>
        <h3 className='text-xl sm:text-2xl font-bold'>Manage Departments</h3>
      </div>
      
      <div className='flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6'>
        <input 
          type="text" 
          placeholder="Search By Department Name" 
          className='w-full sm:w-auto sm:flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500'
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
        <Link 
          to="/admin-dashboard/add-departments" 
          className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-teal-600 rounded text-white hover:bg-teal-700 transition text-center whitespace-nowrap"
        >
          Add New Department
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600 text-sm sm:text-base">Loading departments...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded mb-4 text-sm sm:text-base">
          {error}
        </div>
      ) : departments.length === 0 ? (
        <div className="bg-white rounded shadow p-4 sm:p-6 text-center">
          <p className="text-gray-600 text-sm sm:text-base">
            No departments found. Add your first department!
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th
                          key={header.id}
                          className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                        {header.isPlaceholder ? null : (
                          <div
                            className={
                              header.column.getCanSort()
                                ? 'cursor-pointer select-none hover:text-gray-700'
                                : ''
                            }
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: ' ↑',
                              desc: ' ↓',
                            }[header.column.getIsSorted()] ?? null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-3 sm:px-4 md:px-6 py-4 text-center text-gray-500 text-sm sm:text-base">
                      No departments found matching your search.
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-sm sm:text-base">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 bg-white px-3 sm:px-4 py-3 rounded shadow">
            <div className="flex items-center text-xs sm:text-sm text-gray-700">
              <span>
                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}{' '}
                of {table.getFilteredRowModel().rows.length} departments
              </span>
            </div>
            
            <div className="flex items-center justify-center sm:justify-end space-x-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className={`px-3 py-2 text-xs sm:text-sm font-medium rounded ${
                  table.getCanPreviousPage()
                    ? 'bg-teal-600 text-white hover:bg-teal-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                } transition`}
              >
                Previous
              </button>

              <span className="text-xs sm:text-sm text-gray-700">
                Page{' '}
                <strong>
                  {table.getState().pagination.pageIndex + 1} of{' '}
                  {table.getPageCount()}
                </strong>
              </span>

              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className={`px-3 py-2 text-xs sm:text-sm font-medium rounded ${
                  table.getCanNextPage()
                    ? 'bg-teal-600 text-white hover:bg-teal-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                } transition`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default DepartmentList