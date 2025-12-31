import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "../routes/PrivateRoute";

// Pages
import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import EmployeeDashboard from "../pages/EmployeeDashboard";
import EmployeeSummary from "../pages/EmployeeSummary";
import EmployeeProfile from "../pages/EmployeeProfile";
import EmployeeSalary from "../pages/EmployeeSalary";
import EmployeeSettings from "../pages/EmployeeSettings";
import Leave from "../pages/Leave";
import Salary from "../pages/Salary";
import Seetings from "../pages/Seetings";

// Components
import AdminSummary from "../components/dashboard/AdminSummary";
import DepartmentList from "../components/department/DepartmentList";
import AddDepartment from "../components/department/AddDepartment";
import EditDepartment from "../components/department/EditDepartment";
import DepartmentDetail from "../components/department/DepartmentDetail";
import EmployeeList from "../components/employee/EmployeeList";
import AddEmployee from "../components/employee/AddEmployee";
import EditEmployee from "../components/employee/EditEmployee";
import EmployeeDetail from "../components/employee/EmployeeDetail";
import SalaryDetail from "../components/salary/SalaryDetail";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Root route redirects to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Admin Protected Routes */}
      <Route
        path="/admin-dashboard/*"
        element={
          <PrivateRoute role="admin">
            <AdminDashboard />
          </PrivateRoute>
        }
      >
        {/* Nested routes will render inside <Outlet /> */}
        <Route index element={<AdminSummary />} /> {/* default page */}
        <Route path="employees" element={<EmployeeList />} />
        <Route path="add-employees" element={<AddEmployee />} />
        <Route path="employee/:id" element={<EmployeeDetail />} />
        <Route path="edit-employee/:id" element={<EditEmployee />} />
        <Route path="departments" element={<DepartmentList />} />
        <Route path="add-departments" element={<AddDepartment />} />
        <Route path="department/:id" element={<DepartmentDetail />} />
        <Route path="edit-department/:id" element={<EditDepartment />} />
        <Route path="Leave" element={<Leave />} />
        <Route path="Salary" element={<Salary />} />
        <Route path="salary/:id" element={<SalaryDetail />} />
        <Route path="Seetings" element={<Seetings />} />
      </Route>

      {/* Employee Protected Routes */}
      <Route
        path="/employee-dashboard/*"
        element={
          <PrivateRoute role="employee">
            <EmployeeDashboard />
          </PrivateRoute>
        }
      >
        {/* Nested routes will render inside <Outlet /> */}
        <Route index element={<EmployeeSummary />} /> {/* default page */}
        <Route path="profile" element={<EmployeeProfile />} />
        <Route path="salary" element={<EmployeeSalary />} />
        <Route path="settings" element={<EmployeeSettings />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

