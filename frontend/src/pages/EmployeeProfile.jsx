import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { clearUser } from '../store/userSlice';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaVenusMars, FaIdCard, FaCamera, FaLock } from 'react-icons/fa';

const EmployeeProfile = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageVersion, setImageVersion] = useState(0);
  const fileInputRef = useRef(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm();

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    getValues: getPasswordValues
  } = useForm();

  useEffect(() => {
    fetchEmployeeData();
  }, []);

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
        if (currentEmployee) {
          // Check if profile image changed
          const previousImage = employee?.profileImage;
          setEmployee(currentEmployee);
          // Update image version if profile image changed
          if (currentEmployee.profileImage && currentEmployee.profileImage !== previousImage) {
            setImageVersion(prev => prev + 1);
          }
          // Populate form
          setValue('name', currentEmployee.name || '');
          setValue('email', currentEmployee.email || '');
          setValue('phone', currentEmployee.phone || '');
          setValue('address', currentEmployee.address || '');
          setValue('dateOfBirth', currentEmployee.dateOfBirth 
            ? new Date(currentEmployee.dateOfBirth).toISOString().split('T')[0] 
            : '');
          setValue('gender', currentEmployee.gender || '');
          setValue('maritalStatus', currentEmployee.maritalStatus || '');
        } else {
          setError('Employee profile not found');
        }
      }
    } catch (err) {
      console.error('Error fetching employee:', err);
      setError('Failed to load profile data');
      toast.error('Failed to load profile', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data) => {
    if (!employee?._id) {
      toast.error('Employee ID not found');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone || '');
      formData.append('address', data.address || '');
      if (data.dateOfBirth) {
        formData.append('dateOfBirth', data.dateOfBirth);
      }
      if (data.gender) {
        formData.append('gender', data.gender);
      }
      if (data.maritalStatus) {
        formData.append('maritalStatus', data.maritalStatus);
      }

      // Append profile image if selected
      if (selectedFile) {
        formData.append('profileImage', selectedFile);
      }

      const response = await axiosInstance.put(`/employee/${employee._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Profile updated successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
        // Update employee state immediately with response data
        if (response.data.employee) {
          setEmployee(response.data.employee);
          // Update image version to force browser to reload image
          if (response.data.employee.profileImage) {
            setImageVersion(prev => prev + 1);
          }
        }
        setEditMode(false);
        setSelectedFile(null);
        setPreview(null);
        // Also refetch to ensure everything is in sync
        fetchEmployeeData();
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  const onPasswordChange = async (data) => {
    try {
      setChangingPassword(true);
      setPasswordError(null);

      const response = await axiosInstance.post('/auth/change-password', {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      });

      if (response.data.success) {
        toast.success('Password changed successfully! Please login again.', {
          position: 'top-right',
          autoClose: 3000,
        });
        
        // Clear user state and token
        dispatch(clearUser());
        localStorage.removeItem('authToken');
        
        // Navigate to login page after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (err) {
      console.error('Error changing password:', err);
      const errorMessage = err.response?.data?.message || 'Failed to change password';
      setPasswordError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (error && !employee) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">My Profile</h2>
              <p className="text-teal-100 mt-1">Manage your personal information</p>
            </div>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-white text-teal-600 rounded hover:bg-gray-100 transition font-medium"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {editMode ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Profile Image
                </label>
                <div className="relative group">
                  <div
                    onClick={handleImageClick}
                    className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-teal-600 cursor-pointer transition-all hover:border-teal-500"
                  >
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : employee?.profileImage ? (
                      <img
                        src={`http://localhost:5000${employee.profileImage}?v=${imageVersion}`}
                        alt={employee.name}
                        className="w-full h-full object-cover"
                        key={`${employee.profileImage}-${imageVersion}`}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-full h-full bg-gray-200 flex items-center justify-center ${
                        preview || employee?.profileImage ? 'hidden' : 'flex'
                      }`}
                    >
                      <FaUser className="text-4xl text-gray-400" />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                      <FaCamera className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Click to change image (Max 5MB)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaUser className="inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaEnvelope className="inline mr-2" />
                    Email *
                  </label>
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaPhone className="inline mr-2" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaCalendarAlt className="inline mr-2" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    {...register('dateOfBirth')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaVenusMars className="inline mr-2" />
                    Gender
                  </label>
                  <select
                    {...register('gender')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Marital Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Marital Status
                  </label>
                  <select
                    {...register('maritalStatus')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Select Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2" />
                  Address
                </label>
                <textarea
                  {...register('address')}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    reset();
                    setSelectedFile(null);
                    setPreview(null);
                    fetchEmployeeData();
                  }}
                  className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Profile Image */}
              {employee?.profileImage && (
                <div className="flex justify-center">
                  <img
                    src={`http://localhost:5000${employee.profileImage}?v=${imageVersion}`}
                    alt={employee.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-teal-600"
                    key={`${employee.profileImage}-${imageVersion}`}
                  />
                </div>
              )}

              {/* Display Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaUser className="inline mr-2" />
                    Full Name
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-800">{employee?.name || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaEnvelope className="inline mr-2" />
                    Email
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-800">{employee?.email || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaPhone className="inline mr-2" />
                    Phone
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-800">{employee?.phone || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaIdCard className="inline mr-2" />
                    Employee ID
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-800">{employee?.employeeId || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaCalendarAlt className="inline mr-2" />
                    Date of Birth
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-800">
                      {employee?.dateOfBirth 
                        ? new Date(employee.dateOfBirth).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaVenusMars className="inline mr-2" />
                    Gender
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-800 capitalize">{employee?.gender || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Marital Status
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-800 capitalize">{employee?.maritalStatus || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Position
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-800">{employee?.position || employee?.designation || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              {employee?.address && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaMapMarkerAlt className="inline mr-2" />
                    Address
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-800 whitespace-pre-wrap">{employee.address}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-6">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Change Password</h2>
              <p className="text-teal-100 mt-1">Update your account password</p>
            </div>
            {!showChangePassword && (
              <button
                onClick={() => setShowChangePassword(true)}
                className="px-4 py-2 bg-white text-teal-600 rounded hover:bg-gray-100 transition font-medium"
              >
                Change Password
              </button>
            )}
          </div>
        </div>

        {showChangePassword && (
          <div className="p-6">
            {passwordError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {passwordError}
              </div>
            )}

            <form onSubmit={handleSubmitPassword(onPasswordChange)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-2xl">
                {/* Old Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaLock className="inline mr-2" />
                    Current Password *
                  </label>
                  <input
                    type="password"
                    {...registerPassword('oldPassword', { required: 'Current password is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  {passwordErrors.oldPassword && (
                    <p className="text-red-600 text-sm mt-1">{passwordErrors.oldPassword.message}</p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaLock className="inline mr-2" />
                    New Password *
                  </label>
                  <input
                    type="password"
                    {...registerPassword('newPassword', { 
                      required: 'New password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters long'
                      }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-red-600 text-sm mt-1">{passwordErrors.newPassword.message}</p>
                  )}
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaLock className="inline mr-2" />
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    {...registerPassword('confirmPassword', { 
                      required: 'Please confirm your new password',
                      validate: value => value === getPasswordValues('newPassword') || 'Passwords do not match'
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-600 text-sm mt-1">{passwordErrors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePassword(false);
                    resetPassword();
                    setPasswordError(null);
                  }}
                  className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition disabled:opacity-50"
                >
                  {changingPassword ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfile;



