const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be defined in environment variables");
}

/* Middleware d'authentification */
const authenticate = (req, res, next) => {
  // Vérification du header Authorization
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Accès refusé. Token manquant ou mal formaté.",
      code: "MISSING_TOKEN",
    });
  }

  // Extraction du token
  const token = authHeader.split(" ")[1];

  // Vérification du token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      let message = "Token invalide";
      let statusCode = 401;

      if (err.name === "TokenExpiredError") {
        message = "Token expiré";
        statusCode = 403;
      } else if (err.name === "JsonWebTokenError") {
        message = "Token malformé";
      }

      return res.status(statusCode).json({
        success: false,
        message,
        code: "INVALID_TOKEN",
      });
    }

    // Ajout des informations utilisateur à la requête
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  });
};

/* Middleware pour vérifier le rôle */
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!Array.isArray(allowedRoles)) {
      allowedRoles = [allowedRoles];
    }

    if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé. Privilèges insuffisants.",
        code: "INSUFFICIENT_PRIVILEGES",
        requiredRoles: allowedRoles,
        yourRole: req.user?.role || "none",
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  checkRole,
  JWT_SECRET, // Exporté pour les tests
};
