import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";

const AddDepartment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Submit handler
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.post("/department/add", {
        departmentName: data.departmentName,
        description: data.description,
      });

      if (response.data.success) {
        reset();
        // Wait 1 second before showing toast
        setTimeout(() => {
          toast.success("Department added successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
          // Navigate back to department list after showing toast
          setTimeout(() => {
            navigate("/admin-dashboard/departments");
          }, 1000);
        }, 1000);
      }
    } catch (err) {
      console.error("Error adding department:", err);
      const errorMessage = err.response?.data?.message || "Failed to add department. Please try again.";
      setError(errorMessage);
      // Show error toast after 1 second
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
    <div className="max-w-xl mx-auto bg-white p-4 sm:p-6 rounded shadow">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
        Add Department
      </h2>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm sm:text-base">
          {error}
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
          {loading ? "Adding Department..." : "Add Department"}
        </button>

      </form>
    </div>
  );
};

export default AddDepartment;
