import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaTachometerAlt, FaUser, FaDollarSign, FaCog, FaTimes, FaCamera } from "react-icons/fa";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { getImageUrl } from "../../utils/config";

const EmployeeSidebar = ({ isOpen, setIsOpen }) => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const [employee, setEmployee] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageVersion, setImageVersion] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const response = await axiosInstance.get('/employee');
      if (response.data.success) {
        const employees = response.data.employees || [];
        const currentEmployee = employees.find(
          (emp) => emp.user?._id === userInfo?.user?._id
        );
        // Check if profile image changed
        const previousImage = employee?.profileImage;
        setEmployee(currentEmployee);
        // Update image version if profile image changed
        if (currentEmployee?.profileImage && currentEmployee.profileImage !== previousImage) {
          setImageVersion(prev => prev + 1);
        }
      }
    } catch (err) {
      console.error('Error fetching employee:', err);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
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

    if (!employee?._id) {
      toast.error('Employee ID not found', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await axiosInstance.put(`/employee/${employee._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Profile image updated successfully!', {
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
        // Also refetch to ensure everything is in sync
        fetchEmployeeData();
      }
    } catch (err) {
      console.error('Error updating profile image:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update profile image';
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const profileImageUrl = employee?.profileImage 
    ? `${getImageUrl(employee.profileImage)}?v=${imageVersion}`
    : null;

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 w-64 space-y-4 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        
        {/* Logo / Brand */}
        <div className="bg-teal-600 h-12 flex items-center justify-between px-4">
          <h3 className="text-xl sm:text-2xl font-dancing text-center flex-1">Employee MS</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-white hover:text-gray-200"
          >
            <FaTimes />
          </button>
        </div>

        {/* Profile Image Section */}
        <div className="px-4 pt-4 pb-2 border-b border-gray-700">
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div
                onClick={handleImageClick}
                className={`relative w-20 h-20 rounded-full overflow-hidden border-2 border-teal-500 cursor-pointer transition-all hover:border-teal-400 ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt={employee?.name || 'Profile'}
                    className="w-full h-full object-cover"
                    key={`${employee?.profileImage}-${imageVersion}`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = e.target.parentElement.querySelector('.profile-fallback');
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className={`profile-fallback w-full h-full bg-gray-700 flex items-center justify-center ${
                    profileImageUrl ? 'hidden' : 'flex'
                  }`}
                >
                  <FaUser className="text-3xl text-gray-400" />
                </div>
                {!uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                    <FaCamera className="text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <p className="mt-2 text-sm text-gray-300 text-center truncate w-full">
              {employee?.name || 'Employee'}
            </p>
            <p className="text-xs text-gray-400 text-center truncate w-full">
              {employee?.email || ''}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 space-y-2 overflow-y-auto h-[calc(100vh-12rem)]">

        <NavLink
          to="/employee-dashboard"
          end
          className={({ isActive }) =>
            `flex items-center space-x-4 py-2.5 px-4 rounded ${
              isActive ? "bg-teal-500 text-white" : "text-gray-300 hover:bg-gray-700"
            }`
          }
          onClick={() => setIsOpen(false)}
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/employee-dashboard/profile"
          className={({ isActive }) =>
            `flex items-center space-x-4 py-2.5 px-4 rounded ${
              isActive ? "bg-teal-500 text-white" : "text-gray-300 hover:bg-gray-700"
            }`
          }
          onClick={() => setIsOpen(false)}
        >
          <FaUser />
          <span>Profile</span>
        </NavLink>

        <NavLink
          to="/employee-dashboard/salary"
          className={({ isActive }) =>
            `flex items-center space-x-4 py-2.5 px-4 rounded ${
              isActive ? "bg-teal-500 text-white" : "text-gray-300 hover:bg-gray-700"
            }`
          }
          onClick={() => setIsOpen(false)}
        >
          <FaDollarSign />
          <span>Salary</span>
        </NavLink>

        <NavLink
          to="/employee-dashboard/settings"
          className={({ isActive }) =>
            `flex items-center space-x-4 py-2.5 px-4 rounded ${
              isActive ? "bg-teal-500 text-white" : "text-gray-300 hover:bg-gray-700"
            }`
          }
          onClick={() => setIsOpen(false)}
        >
          <FaCog />
          <span>Settings</span>
        </NavLink>

        </div>
      </div>
    </>
  );
};

export default EmployeeSidebar;

