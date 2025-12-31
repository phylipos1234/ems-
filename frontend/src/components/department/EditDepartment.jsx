import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const EditDepartment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  // Fetch department by ID on component mount
  useEffect(() => {
    fetchDepartmentById();
  }, [id]);

  const fetchDepartmentById = async () => {
    try {
      setFetchLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/department/${id}`);
      
      if (response.data.success) {
        const department = response.data.department;
        // Populate form with existing data
        setValue("departmentName", department.departmentName);
        setValue("description", department.description);
      }
    } catch (err) {
      console.error("Error fetching department:", err);
      setError(
        err.response?.data?.message || "Failed to load department. Please try again."
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

      const response = await axiosInstance.put(`/department/${id}`, {
        departmentName: data.departmentName,
        description: data.description,
      });

      if (response.data.success) {
        setSuccess("Department updated successfully!");
        // Navigate back to department list after a delay
        setTimeout(() => {
          navigate("/admin-dashboard/departments");
        }, 1500);
      }
    } catch (err) {
      console.error("Error updating department:", err);
      setError(
        err.response?.data?.message || "Failed to update department. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="max-w-xl mx-auto bg-white p-4 sm:p-6 rounded shadow">
        <div className="text-center py-8">
          <p className="text-gray-600 text-sm sm:text-base">Loading department...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-4 sm:p-6 rounded shadow">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
        Edit Department
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
        {/* Department Name */}
        <div>
          <label className="block font-semibold mb-1">
            Department Name
          </label>
          <input
            type="text"
            placeholder="Enter department name"
            {...register("departmentName", {
              required: "Department name is required",
              minLength: {
                value: 3,
                message: "Department name must be at least 3 characters",
              },
            })}
            className={`w-full px-4 py-2 border rounded focus:outline-none ${
              errors.departmentName
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.departmentName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.departmentName.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-1">
            Description
          </label>
          <textarea
            rows="4"
            placeholder="Enter department description"
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters",
              },
            })}
            className={`w-full px-4 py-2 border rounded focus:outline-none ${
              errors.description
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin-dashboard/departments")}
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
            {loading ? "Updating Department..." : "Update Department"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDepartment;

