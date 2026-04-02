import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function AuthGuard({ children }) {
  const { getDashboardPath, loading, user, userProfile } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return <Navigate replace to={getDashboardPath(userProfile || user)} />;
  }

  return children;
}

export default AuthGuard;
