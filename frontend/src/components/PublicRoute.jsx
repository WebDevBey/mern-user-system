import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { auth, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while checking auth
  }

  if (auth && auth.accessToken) {
    return <Navigate to="/" />; // Redirect to home if already authenticated
  }

  return children; // Render the public route if not authenticated
}
