import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import type { JSX } from "react";


export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
