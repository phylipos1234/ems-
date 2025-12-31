import React, { useState } from 'react'
import Add from '../components/salary/Add'
import SalaryList from '../components/salary/SalaryList'

const Salary = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSuccess = () => {
    // Refresh salary list after successful addition
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Salary Management</h1>
        <button
          onClick={handleOpenModal}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
        >
          Add New Salary
        </button>
      </div>

      {/* Salary List */}
      <SalaryList refreshTrigger={refreshTrigger} />

      {/* Add Salary Modal */}
      <Add
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
      />
    </div>
  )
}

export default Salary