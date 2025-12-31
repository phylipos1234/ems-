import React from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaBuilding, FaRegCalendarAlt, FaDollarSign, FaCog, FaTimes } from "react-icons/fa";

const AdminSidebar = ({ isOpen, setIsOpen }) => {
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

        {/* Navigation */}
        <div className="px-4 space-y-2 overflow-y-auto h-[calc(100vh-3rem)]">

        <NavLink
          to="/admin-dashboard"
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
          to="/admin-dashboard/employees"
          className={({ isActive }) =>
            `flex items-center space-x-4 py-2.5 px-4 rounded ${
              isActive ? "bg-teal-500 text-white" : "text-gray-300 hover:bg-gray-700"
            }`
          }
          onClick={() => setIsOpen(false)}
        >
          <FaUsers />
          <span>Employee</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/departments"
          className={({ isActive }) =>
            `flex items-center space-x-4 py-2.5 px-4 rounded ${
              isActive ? "bg-teal-500 text-white" : "text-gray-300 hover:bg-gray-700"
            }`
          }
          onClick={() => setIsOpen(false)}
        >
          <FaBuilding />
          <span>Department</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/leave"
          className={({ isActive }) =>
            `flex items-center space-x-4 py-2.5 px-4 rounded ${
              isActive ? "bg-teal-500 text-white" : "text-gray-300 hover:bg-gray-700"
            }`
          }
          onClick={() => setIsOpen(false)}
        >
          <FaRegCalendarAlt />
          <span>Leave</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/salary"
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
          to="/admin-dashboard/settings"
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

export default AdminSidebar;
