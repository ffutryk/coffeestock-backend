import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ usuario, allowedRoles = [], children }) {
  const role = usuario?.role;

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
