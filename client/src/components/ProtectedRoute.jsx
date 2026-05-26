import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ usuario, allowedRoles = [], children }) {
  const role = usuario?.role;
  if (!usuario || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
