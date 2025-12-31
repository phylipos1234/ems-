import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance"; // your axios instance

function Login() {
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const loginMutation = useMutation({
    mutationFn: async (data) => {
      // Login request
      const res = await axios.post("http://localhost:5000/api/auth/login", data);
      return res.data;
    },
    onSuccess: async (data) => {
      setErrorMessage("");

      // Save user and token in Redux
      dispatch(setUser({ user: data.user, token: data.token }));

      // Persist token in localStorage
      localStorage.setItem("authToken", data.token);

      // Example: fetch protected data after login
      try {
        const statsRes = await axiosInstance.get("/admin/stats");
        console.log("Protected stats:", statsRes.data);
      } catch (err) {
        console.error("Error fetching protected data:", err);
      }

      // Redirect based on role
      if (data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/employee-dashboard");
      }
    },
    onError: (error) => {
      setErrorMessage(error.response?.data?.message || "Login failed");
    }
  });

  const onSubmit = (formData) => {
    loginMutation.mutate(formData);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center px-4 py-8 relative">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-green-500"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white"></div>

      <div className="relative z-10 w-full mt-24 max-w-2xl flex flex-col items-center">
        <h1 className="font-dancing text-5xl md:text-7xl text-white text-center mb-8 drop-shadow-lg">
          Employee Management System
        </h1>

        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md md:max-w-lg p-8 mx-4">
          <h2 className="text-3xl md:text-4xl font-dancing font-bold text-green-600 text-center mb-6">
            Login
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center">
            {/* Email */}
            <div className="w-full mb-4 flex flex-col items-center">
              <label className="text-gray-700 mb-2 text-lg">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: "Email is required" })}
                className="w-3/4 px-5 py-3 border border-black rounded-xl focus:ring-2 focus:ring-green-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="w-full mb-4 flex flex-col items-center">
              <label className="text-gray-700 mb-2 text-lg">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
                className="w-3/4 px-5 py-3 border border-black rounded-xl focus:ring-2 focus:ring-green-500"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Error message */}
            {errorMessage && (
              <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
            )}

            {/* Remember Me */}
            <div className="flex justify-between w-3/4 mb-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="h-5 w-5" />
                <span className="text-gray-700 select-none">Remember me</span>
              </label>
              <a href="#" className="text-green-600 hover:underline">Forgot password?</a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-3/4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold hover:scale-105 transition"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
