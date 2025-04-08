const { Router } = require("express");
const { authenticate, checkRole } = require("../middlewares/authMiddleware");
const { User, Hotel, Booking } = require("../models");
const { query, validationResult } = require("express-validator");

const router = Router();

// Validation pour les paramètres de requête
const dashboardValidation = [
  query("limit").optional().isInt({ min: 1, max: 50 }).toInt(),
  query("offset").optional().isInt({ min: 0 }).toInt(),
];

router.get(
  "/admin/dashboard",
  authenticate,
  checkRole("admin"),
  dashboardValidation,
  async (req, res) => {
    try {
      // Valider les paramètres de requête
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { limit = 5, offset = 0 } = req.query;

      // Utiliser Promise.all pour les requêtes parallèles
      const [
        totalUsers,
        totalAdmins,
        totalClients,
        totalHotels,
        totalBookings,
        recentBookings,
      ] = await Promise.all([
        User.count(),
        User.count({ where: { role: "admin" } }),
        User.count({ where: { role: "simple-user" } }),
        Hotel.count(),
        Booking.count(),
        Booking.findAll({
          order: [["created_at", "DESC"]],
          limit,
          offset,
          include: [
            {
              model: User,
              attributes: ["id", "first_name", "last_name", "email"],
            },
          ],
        }),
      ]);

      return res.json({
        success: true,
        data: {
          user: req.user,
          stats: {
            utilisateurs: {
              total: totalUsers,
              admins: totalAdmins,
              clients: totalClients,
            },
            hotels: totalHotels,
            reservations: totalBookings,
            recentes: recentBookings,
          },
        },
        meta: { limit, offset },
      });
    } catch (error) {
      console.error("Erreur dans le dashboard admin :", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
);

module.exports = router;
