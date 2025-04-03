import { Router } from "express";
import { authenticate, checkRole } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/admin/dashboard", authenticate, checkRole("admin"), (req, res) => {
    res.json({
      message: "Bienvenue sur le tableau de bord de l'admin !",
      user: req.user,
    });
});

export default router;