import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { FaDollarSign, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';

const EmployeeSalary = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const [employee, setEmployee] = useState(null);
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  useEffect(() => {
    if (employee?._id) {
      fetchSalaryData();
    }
  }, [employee?._id]);

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/employee');
      if (response.data.success) {
        const employees = response.data.employees || [];
        const currentEmployee = employees.find(
          (emp) => emp.user?._id === userInfo?.user?._id
        );
        setEmployee(currentEmployee);
        if (!currentEmployee) {
          setError('Employee profile not found');
        }
      }
    } catch (err) {
      console.error('Error fetching employee:', err);
      setError('Failed to load employee data');
      toast.error('Failed to load employee data', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSalaryData = async () => {
    try {
      const response = await axiosInstance.get('/salary');
      if (response.data.success) {
        const allSalaries = response.data.salaries || [];
        // Filter salaries for current employee
        const employeeSalaries = allSalaries.filter(
          (sal) => sal.employee?._id === employee._id
        );
        // Sort by pay date (newest first)
        employeeSalaries.sort((a, b) => new Date(b.payDate) - new Date(a.payDate));
        setSalaries(employeeSalaries);
      }
    } catch (err) {
      console.error('Error fetching salaries:', err);
      toast.error('Failed to load salary records', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateNetSalary = (salary) => {
    const basic = salary.basicSalary || 0;
    const allowance = salary.allowance || 0;
    const deduction = salary.deduction || 0;
    return basic + allowance - deduction;
  };

  const calculateTotal = () => {
    return salaries.reduce((sum, sal) => sum + calculateNetSalary(sal), 0);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading salary information...</p>
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Salary</h1>
        <p className="text-gray-600 mt-1">View your salary records and history</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Records</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{salaries.length}</p>
            </div>
            <FaFileAlt className="text-3xl text-teal-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Earned</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {formatCurrency(calculateTotal())}
              </p>
            </div>
            <FaDollarSign className="text-3xl text-teal-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Latest Payment</p>
              <p className="text-lg font-bold text-gray-800 mt-1">
                {salaries.length > 0 
                  ? formatDate(salaries[0].payDate)
                  : 'N/A'}
              </p>
            </div>
            <FaCalendarAlt className="text-3xl text-teal-600" />
          </div>
        </div>
      </div>

      {/* Salary Records Table */}
      {salaries.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <FaFileAlt className="text-5xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No salary records found</p>
          <p className="text-gray-500 text-sm mt-2">
            Your salary records will appear here once they are added by the administrator.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pay Date
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salaries.map((salary) => (
                  <tr key={salary._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(salary.payDate)}
                      </div>
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
                      <div className="text-sm text-green-600">
                        +{formatCurrency(salary.allowance)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-red-600">
                        -{formatCurrency(salary.deduction)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-teal-600">
                        {formatCurrency(calculateNetSalary(salary))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeSalary;



