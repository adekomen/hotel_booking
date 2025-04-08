import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface PrivateRouteProps {
  requiredRole?: string;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ requiredRole }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    // Redirection vers la page de connexion si non authentifié
    return <Navigate to="/login" replace />;
  }

  // Vérification du rôle si un rôle est requis
  if (requiredRole && user?.role !== requiredRole) {
    // Redirection vers la page d'accueil si le rôle n'est pas approprié
    return <Navigate to="/" replace />;
  }

  // Si tout est bon, afficher les éléments enfants (routes imbriquées)
  return <Outlet />;
};
