import React from "react"
import SummeryCard from "../dashboard/SummeryCard"
import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaBuilding
} from "react-icons/fa"

const AdminSummary = () => {
  return (
    <div className="p-3 sm:p-4 md:p-6">
      
      {/* Dashboard Overview */}
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        Dashboard Overview
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <SummeryCard icon={<FaUsers />} text="Total Employees" number={13} />
        <SummeryCard icon={<FaUserCheck />} text="Active Employees" number={10} />
        <SummeryCard icon={<FaUserTimes />} text="Inactive Employees" number={3} />
        <SummeryCard icon={<FaBuilding />} text="Departments" number={5} />
      </div>

      {/* Leave Details */}
      <div className="mt-8 sm:mt-12 md:mt-14">
        <h4 className="text-center text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          Leave Details
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <SummeryCard icon={<FaUsers />} text="Leave Applied" number={13} />
          <SummeryCard icon={<FaUserCheck />} text="Leave Approved" number={10} />
          <SummeryCard icon={<FaUserTimes />} text="Leave Pending" number={3} />
          <SummeryCard icon={<FaBuilding />} text="Leave Rejected" number={5} />
        </div>
      </div>

    </div>
  )
}

export default AdminSummary
