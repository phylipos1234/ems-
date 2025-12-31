import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";

const AddEmployee = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  // Fetch departments for dropdown
  useEffect(() => {
    fetchDepartments();
  }, []);

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

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Designation options
  const designationOptions = [
    "Manager",
    "Senior Developer",
    "Developer",
    "Junior Developer",
    "Designer",
    "HR Manager",
    "HR Executive",
    "Accountant",
    "Sales Executive",
    "Marketing Manager",
    "Project Manager",
    "Team Lead",
    "QA Engineer",
    "DevOps Engineer",
    "Other"
  ];

  // Submit handler
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("employeeId", data.employeeId || "");
      formData.append("dateOfBirth", data.dateOfBirth || "");
      formData.append("gender", data.gender || "");
      formData.append("maritalStatus", data.maritalStatus || "");
      formData.append("designation", data.designation || "");
      formData.append("department", data.department || "");
      formData.append("salary", data.salary || "0");
      formData.append("role", data.role || "employee");
      formData.append("phone", data.phone || "");
      formData.append("address", data.address || "");
      formData.append("hireDate", data.hireDate || new Date().toISOString().split('T')[0]);
      formData.append("status", data.status || "active");

      // Append file if selected
      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }

      const response = await axiosInstance.post("/employee/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        reset();
        setSelectedFile(null);
        setPreview(null);
        setTimeout(() => {
          toast.success("Employee added successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
          setTimeout(() => {
            navigate("/admin-dashboard/employees");
          }, 1000);
        }, 1000);
      }
    } catch (err) {
      console.error("Error adding employee:", err);
      const errorMessage = err.response?.data?.message || "Failed to add employee. Please try again.";
      setError(errorMessage);
      setTimeout(() => {
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 rounded shadow">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
        Add Employee
      </h2>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm sm:text-base">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name and Email Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        {/* Employee ID and Date of Birth Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Employee ID */}
          <div>
            <label className="block font-semibold mb-1">
              Employee ID
            </label>
            <input
              type="text"
              placeholder="Enter employee ID"
              {...register("employeeId")}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block font-semibold mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              {...register("dateOfBirth")}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
            />
          </div>
        </div>

        {/* Gender and Marital Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Gender */}
          <div>
            <label className="block font-semibold mb-1">
              Gender
            </label>
            <select
              {...register("gender")}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Marital Status */}
          <div>
            <label className="block font-semibold mb-1">
              Marital Status
            </label>
            <select
              {...register("maritalStatus")}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
            >
              <option value="">Select Marital Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>
        </div>

        {/* Designation and Department Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Designation */}
          <div>
            <label className="block font-semibold mb-1">
              Designation
            </label>
            <select
              {...register("designation")}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
            >
              <option value="">Select Designation</option>
              {designationOptions.map((designation) => (
                <option key={designation} value={designation}>
                  {designation}
                </option>
              ))}
            </select>
          </div>

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
        </div>

        {/* Salary and Role Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Role */}
          <div>
            <label className="block font-semibold mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              {...register("role", {
                required: "Role is required",
              })}
              className={`w-full px-4 py-2 border rounded focus:outline-none ${
                errors.role
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value="">Select Role</option>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">
                {errors.role.message}
              </p>
            )}
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block font-semibold mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            placeholder="Enter password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className={`w-full px-4 py-2 border rounded focus:outline-none ${
              errors.password
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Phone and Hire Date Row */}
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

        {/* Profile Image Upload */}
        <div>
          <label className="block font-semibold mb-1">
            Profile Image
          </label>
          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
            />
            {preview && (
              <div className="mt-2">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded border border-gray-300"
                />
              </div>
            )}
            <p className="text-sm text-gray-500">
              Accepted formats: JPEG, JPG, PNG, GIF, WEBP (Max 5MB)
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-teal-600 text-white py-2 rounded transition ${
            loading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-teal-700"
          }`}
        >
          {loading ? "Adding Employee..." : "Add Employee"}
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;

