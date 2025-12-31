import React,{ useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { clearUser } from "../../store/userSlice";

const Navbar = ({ setSidebarOpen }) => {
const userInfo = useSelector((state) => state.user.userInfo);
const dispatch = useDispatch();
const navigate = useNavigate();

 useEffect(() => {
    console.log("AdminDashboard userInfo:", userInfo);
  }, [userInfo]);

  const handleLogout = () => {
    // Clear user from Redux store and localStorage
    dispatch(clearUser());
    // Remove auth token from localStorage
    localStorage.removeItem("authToken");
    // Navigate to login page
    navigate("/login");
  };

  return (
    <div className='flex items-center text-white justify-between h-12 bg-teal-600 px-3 sm:px-5'>
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden p-2 hover:bg-teal-700 rounded transition"
        aria-label="Open menu"
      >
        <FaBars className="text-xl" />
      </button>
      <p className="text-sm sm:text-base truncate flex-1 ml-2 sm:ml-0">Welcome {userInfo?.user?.name || 'User'}</p>
      <button 
        onClick={handleLogout}
        className='px-3 sm:px-4 py-1 text-sm sm:text-base bg-teal-700 hover:bg-teal-800 rounded transition whitespace-nowrap'
      >
        Logout
      </button>
    </div>
  )
}

export default Navbar