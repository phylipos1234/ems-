import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../api/axiosInstance';
import { FaUser, FaDollarSign, FaBuilding, FaCalendarAlt } from 'react-icons/fa';

const EmployeeSummary = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const [employee, setEmployee] = useState(null);
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployeeData();
    fetchSalaryData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      // Get all employees and find the one matching current user
      const response = await axiosInstance.get('/employee');
      if (response.data.success) {
        const employees = response.data.employees || [];
        const currentEmployee = employees.find(
          (emp) => emp.user?._id === userInfo?.user?._id
        );
        setEmployee(currentEmployee);
      }
    } catch (err) {
      console.error('Error fetching employee:', err);
      setError('Failed to load employee data');
    } finally {
      setLoading(false);
    }
  };

  const fetchSalaryData = async (employeeId) => {
    if (!employeeId) return;
    
    try {
      const response = await axiosInstance.get('/salary');
      if (response.data.success) {
        const allSalaries = response.data.salaries || [];
        // Filter salaries for current employee
        const employeeSalaries = allSalaries.filter(
          (sal) => sal.employee?._id === employeeId
        );
        setSalaries(employeeSalaries);
      }
    } catch (err) {
      console.error('Error fetching salaries:', err);
    }
  };

  useEffect(() => {
    if (employee?._id) {
      fetchSalaryData(employee._id);
    }
  }, [employee?._id]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  const totalSalary = salaries.reduce((sum, sal) => {
    return sum + (sal.basicSalary || 0) + (sal.allowance || 0) - (sal.deduction || 0);
  }, 0);

  const latestSalary = salaries.length > 0 ? salaries[0] : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {employee?.name || userInfo?.user?.name || 'Employee'}!</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Status</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {employee?.status ? (
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    employee.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : employee.status === 'on-leave'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {employee.status}
                  </span>
                ) : 'N/A'}
              </p>
            </div>
            <FaUser className="text-3xl text-teal-600" />
          </div>
        </div>

        {/* Department Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Department</p>
              <p className="text-xl font-bold text-gray-800 mt-1">
                {employee?.department?.departmentName || 'N/A'}
              </p>
            </div>
            <FaBuilding className="text-3xl text-teal-600" />
          </div>
        </div>

        {/* Latest Salary Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Latest Salary</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {latestSalary 
                  ? `$${((latestSalary.basicSalary || 0) + (latestSalary.allowance || 0) - (latestSalary.deduction || 0)).toLocaleString()}`
                  : 'N/A'}
              </p>
            </div>
            <FaDollarSign className="text-3xl text-teal-600" />
          </div>
        </div>

        {/* Total Records Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Salary Records</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {salaries.length}
              </p>
            </div>
            <FaCalendarAlt className="text-3xl text-teal-600" />
          </div>
        </div>
      </div>

      {/* Employee Info Section */}
      {employee && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="text-lg font-semibold text-gray-800">{employee.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-semibold text-gray-800">{employee.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Position</p>
              <p className="text-lg font-semibold text-gray-800">{employee.position || employee.designation || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Employee ID</p>
              <p className="text-lg font-semibold text-gray-800">{employee.employeeId || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Hire Date</p>
              <p className="text-lg font-semibold text-gray-800">
                {employee.hireDate 
                  ? new Date(employee.hireDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="text-lg font-semibold text-gray-800">{employee.phone || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeSummary;

