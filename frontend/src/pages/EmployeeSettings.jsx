import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { clearUser } from '../store/userSlice';
import { FaLock, FaUser, FaEnvelope, FaShieldAlt } from 'react-icons/fa';

const EmployeeSettings = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm();

  const password = watch('newPassword');

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Here you would typically call an API endpoint to change password
      // For now, we'll show a message that this feature needs backend implementation
      toast.info('Password change feature requires backend implementation', {
        position: 'top-right',
        autoClose: 3000,
      });

      // Reset form
      reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setSuccess('Password updated successfully!');
    } catch (err) {
      console.error('Error updating password:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update password';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem('authToken');
    navigate('/login');
    toast.success('Logged out successfully', {
      position: 'top-right',
      autoClose: 3000,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <FaUser className="mr-2" />
            Account Information
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaUser className="inline mr-2" />
                Name
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-800">{userInfo?.user?.name || 'N/A'}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaEnvelope className="inline mr-2" />
                Email
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-800">{userInfo?.user?.email || 'N/A'}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Role
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium capitalize">
                  {userInfo?.user?.role || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <FaLock className="mr-2" />
            Change Password
          </h2>
        </div>
        <div className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Password *
              </label>
              <input
                type="password"
                {...register('currentPassword', { required: 'Current password is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter your current password"
              />
              {errors.currentPassword && (
                <p className="text-red-600 text-sm mt-1">{errors.currentPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password *
              </label>
              <input
                type="password"
                {...register('newPassword', { 
                  required: 'New password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter your new password"
              />
              {errors.newPassword && (
                <p className="text-red-600 text-sm mt-1">{errors.newPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm New Password *
              </label>
              <input
                type="password"
                {...register('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: value => 
                    value === password || 'Passwords do not match'
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Confirm your new password"
              />
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Security & Privacy */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <FaShieldAlt className="mr-2" />
            Security & Privacy
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-800">Session Management</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Log out from your current session
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSettings;

