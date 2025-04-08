const { Router } = require("express");
const { authenticate, checkRole } = require("../middlewares/authMiddleware");
const { User } = require("../models");

const router = Router();

router.get(
  "/user/profile",
  authenticate,
  checkRole("simple-user"),
  async (req, res) => {
    try {
      // Récupérer les données complètes de l'utilisateur
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ["password_hash"] },
        include: [
          /* vos associations ici */
        ],
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Utilisateur non trouvé",
        });
      }

      res.json({
        success: true,
        data: {
          message: "Profil utilisateur",
          user,
        },
      });
    } catch (error) {
      console.error("Erreur profile utilisateur:", error);
      res.status(500).json({
        success: false,
        message: "Erreur serveur",
      });
    }
  }
);

module.exports = router;
