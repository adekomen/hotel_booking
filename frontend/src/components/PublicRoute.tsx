import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const PublicRoute: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  // Si l'utilisateur est déjà connecté, rediriger vers la page appropriée
  if (isAuthenticated) {
    return (
      <Navigate
        to={user?.role === "admin" ? "/admin/dashboard" : "/"}
        replace
      />
    );
  }

  // Sinon, afficher la route publique
  return <Outlet />;
};
