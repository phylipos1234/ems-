import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";

const Add = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const selectedDepartment = watch("department");

  // Fetch departments and employees
  useEffect(() => {
    if (isOpen) {
      fetchDepartments();
      fetchEmployees();
      reset(); // Reset form when modal opens
      setError(null);
    }
  }, [isOpen, reset]);

  // Filter employees based on selected department
  useEffect(() => {
    if (selectedDepartment) {
      const filtered = employees.filter(
        (emp) => emp.department?._id === selectedDepartment || emp.department === selectedDepartment
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }
  }, [selectedDepartment, employees]);

  const fetchDepartments = async () => {
    try {
      const response = await axiosInstance.get("/department");
      if (response.data.success) {
        setDepartments(response.data.departments);
      }
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axiosInstance.get("/employee");
      if (response.data.success) {
        setEmployees(response.data.employees || []);
        setFilteredEmployees(response.data.employees || []);
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  // Submit handler
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      const salaryData = {
        department: data.department,
        employee: data.employee,
        basicSalary: parseFloat(data.basicSalary) || 0,
        allowance: parseFloat(data.allowance) || 0,
        deduction: parseFloat(data.deduction) || 0,
        payDate: data.payDate,
      };

      // TODO: Replace with actual salary API endpoint when available
      // For now, this is a placeholder
      const response = await axiosInstance.post("/salary/add", salaryData);

      if (response.data.success) {
        reset();
        toast.success("Salary added successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      }
    } catch (err) {
      console.error("Error adding salary:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to add salary. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Close modal on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Add New Salary
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Department and Employee Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Department */}
              <div>
                <label className="block font-semibold mb-1 text-gray-700">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("department", {
                    required: "Department is required",
                  })}
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.department
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.departmentName}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.department.message}
                  </p>
                )}
              </div>

              {/* Employee */}
              <div>
                <label className="block font-semibold mb-1 text-gray-700">
                  Employee <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("employee", {
                    required: "Employee is required",
                  })}
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.employee
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  disabled={!selectedDepartment}
                >
                  <option value="">
                    {selectedDepartment
                      ? "Select Employee"
                      : "Select Department First"}
                  </option>
                  {filteredEmployees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} {emp.employeeId ? `(${emp.employeeId})` : ""}
                    </option>
                  ))}
                </select>
                {errors.employee && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.employee.message}
                  </p>
                )}
              </div>
            </div>

            {/* Basic Salary, Allowance, and Deduction Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Basic Salary */}
              <div>
                <label className="block font-semibold mb-1 text-gray-700">
                  Basic Salary <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  {...register("basicSalary", {
                    required: "Basic salary is required",
                    min: {
                      value: 0,
                      message: "Basic salary must be 0 or greater",
                    },
                  })}
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.basicSalary
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.basicSalary && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.basicSalary.message}
                  </p>
                )}
              </div>

              {/* Allowance */}
              <div>
                <label className="block font-semibold mb-1 text-gray-700">
                  Allowance
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  {...register("allowance", {
                    min: {
                      value: 0,
                      message: "Allowance must be 0 or greater",
                    },
                  })}
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.allowance
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.allowance && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.allowance.message}
                  </p>
                )}
              </div>

              {/* Deduction */}
              <div>
                <label className="block font-semibold mb-1 text-gray-700">
                  Deduction
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  {...register("deduction", {
                    min: {
                      value: 0,
                      message: "Deduction must be 0 or greater",
                    },
                  })}
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.deduction
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.deduction && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.deduction.message}
                  </p>
                )}
              </div>
            </div>

            {/* Pay Date */}
            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Pay Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register("payDate", {
                  required: "Pay date is required",
                })}
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  errors.payDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.payDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.payDate.message}
                </p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded transition hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 bg-teal-600 text-white py-2 px-4 rounded transition ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-teal-700"
                }`}
              >
                {loading ? "Adding Salary..." : "Add Salary"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Add;
