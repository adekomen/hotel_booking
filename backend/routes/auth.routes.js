import { Router } from "express";
import { body } from "express-validator";
import { register, login } from "../controllers/authController.js";

const router = Router();

/* Validations pour la partie register */
const registerValidation = [
  body("email").isEmail().withMessage("L'email n'est pas valide"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Le mot de passe doit contenir au moins 8 caractères"),
  body("first_name").notEmpty().withMessage("Le prénom est requis"),
  body("last_name").notEmpty().withMessage("Le nom est requis"),
  body("sexe")
    .isIn(["Masculin", "Féminin"])
    .withMessage("Le sexe doit être 'Masculin' ou 'Féminin'"),
  body("role")
    .isIn(["admin", "simple-user"])
    .withMessage("Le rôle doit être 'admin' ou 'simple-user'"),
];

/* Validations pour la partie login */
const loginValidation = [
  body("email").isEmail().withMessage("L'email est invalide"),
  body("password").notEmpty().withMessage("Le mot de passe est requis"),
];

router.post("/register", registerValidation, register);

router.post("/login", loginValidation, login);

export default router;