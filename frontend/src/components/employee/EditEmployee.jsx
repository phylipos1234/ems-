import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";

const EditEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [departments, setDepartments] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  // Fetch departments and employee data
  useEffect(() => {
    fetchDepartments();
    fetchEmployeeById();
  }, [id]);

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

  const fetchEmployeeById = async () => {
    try {
      setFetchLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/employee/${id}`);
      
      if (response.data.success) {
        const employee = response.data.employee;
        // Populate form with existing data
        setValue("name", employee.name);
        setValue("email", employee.email);
        setValue("phone", employee.phone || "");
        setValue("address", employee.address || "");
        setValue("position", employee.position || "");
        setValue("department", employee.department?._id || "");
        setValue("salary", employee.salary || 0);
        setValue("hireDate", employee.hireDate ? new Date(employee.hireDate).toISOString().split('T')[0] : "");
        setValue("status", employee.status || "active");
      }
    } catch (err) {
      console.error("Error fetching employee:", err);
      setError(
        err.response?.data?.message || "Failed to load employee. Please try again."
      );
    } finally {
      setFetchLoading(false);
    }
  };

  // Submit handler
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await axiosInstance.put(`/employee/${id}`, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        position: data.position,
        department: data.department || null,
        salary: data.salary ? parseFloat(data.salary) : 0,
        hireDate: data.hireDate || new Date().toISOString().split('T')[0],
        status: data.status || 'active',
      });

      if (response.data.success) {
        setSuccess("Employee updated successfully!");
        setTimeout(() => {
          toast.success("Employee updated successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
          setTimeout(() => {
            navigate("/admin-dashboard/employees");
          }, 1000);
        }, 500);
      }
    } catch (err) {
      console.error("Error updating employee:", err);
      const errorMessage = err.response?.data?.message || "Failed to update employee. Please try again.";
      setError(errorMessage);
      setTimeout(() => {
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-4 sm:p-6 rounded shadow">
        <div className="text-center py-8">
          <p className="text-gray-600 text-sm sm:text-base">Loading employee...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-4 sm:p-6 rounded shadow">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
        Edit Employee
      </h2>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm sm:text-base">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm sm:text-base">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block font-semibold mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter employee name"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
            className={`w-full px-4 py-2 border rounded focus:outline-none ${
              errors.name
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block font-semibold mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="Enter email address"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className={`w-full px-4 py-2 border rounded focus:outline-none ${
              errors.email
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone and Position Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phone */}
          <div>
            <label className="block font-semibold mb-1">
              Phone
            </label>
            <input
              type="tel"
              placeholder="Enter phone number"
              {...register("phone")}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
            />
          </div>

          {/* Position */}
          <div>
            <label className="block font-semibold mb-1">
              Position
            </label>
            <input
              type="text"
              placeholder="Enter position"
              {...register("position")}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
            />
          </div>
        </div>

        {/* Department and Salary Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Department */}
          <div>
            <label className="block font-semibold mb-1">
              Department
            </label>
            <select
              {...register("department")}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.departmentName}
                </option>
              ))}
            </select>
          </div>

          {/* Salary */}
          <div>
            <label className="block font-semibold mb-1">
              Salary
            </label>
            <input
              type="number"
              placeholder="Enter salary"
              step="0.01"
              min="0"
              {...register("salary")}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
            />
          </div>
        </div>

        {/* Hire Date and Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hire Date */}
          <div>
            <label className="block font-semibold mb-1">
              Hire Date
            </label>
            <input
              type="date"
              {...register("hireDate")}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block font-semibold mb-1">
              Status
            </label>
            <select
              {...register("status")}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-leave">On Leave</option>
            </select>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block font-semibold mb-1">
            Address
          </label>
          <textarea
            rows="3"
            placeholder="Enter address"
            {...register("address")}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin-dashboard/employees")}
            className="w-full sm:flex-1 bg-gray-500 text-white py-2 text-sm sm:text-base rounded hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:flex-1 bg-teal-600 text-white py-2 text-sm sm:text-base rounded transition ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-teal-700"
            }`}
          >
            {loading ? "Updating Employee..." : "Update Employee"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEmployee;

