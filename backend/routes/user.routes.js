import { Router } from "express";
import { authenticate, checkRole } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/user/profile", authenticate, checkRole("simple-user"), (req, res) => {
  res.json({
    message: "Bienvenue sur votre profil utilisateur !",
    user: req.user,
  });
});

export default router;