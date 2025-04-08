const { Router } = require("express");
const { body } = require("express-validator");
const { register, login } = require("../controllers/authController");
const rateLimit = require("express-rate-limit");

const router = Router();

// Limiteur de taux pour prévenir les attaques par force brute
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limite à 10 requêtes
  message: "Trop de tentatives, veuillez réessayer plus tard",
});

const registerValidation = [
  body("email").isEmail().withMessage("Email invalide").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("8 caractères minimum")
    .matches(/[0-9]/)
    .withMessage("Doit contenir un chiffre")
    .matches(/[a-zA-Z]/)
    .withMessage("Doit contenir une lettre"),
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("Prénom requis")
    .isLength({ max: 100 })
    .withMessage("100 caractères maximum"),
  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("Nom requis")
    .isLength({ max: 100 })
    .withMessage("100 caractères maximum"),
  body("sexe").isIn(["Masculin", "Féminin"]).withMessage("Valeur non valide"),
  body("role")
    .optional()
    .isIn(["admin", "simple-user"])
    .withMessage("Rôle non valide"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Email invalide").normalizeEmail(),
  body("password").notEmpty().withMessage("Mot de passe requis"),
];

router.post("/register", authLimiter, registerValidation, register);
router.post("/login", authLimiter, loginValidation, login);

module.exports = router;
