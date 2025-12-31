import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/dashboard/Adminsidebar";
import Navbar from "../components/dashboard/Navbar"; // adjust path if needed

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex relative">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 bg-gray-100 min-h-screen w-full">
        <Navbar setSidebarOpen={setSidebarOpen} />
        <div className="p-3 sm:p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
