import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children, role }) => {
  const userInfo = useSelector((state) => state.user.userInfo);

  // Not logged in
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  // Role-based check (optional)
 if (role && userInfo.user.role !== role) {
  return <Navigate to="/unauthorized" replace />;
}

  return children;
};

export default PrivateRoute;
