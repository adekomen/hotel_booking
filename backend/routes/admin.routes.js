const { Router } = require('express');
const { authenticate, checkRole } = require('../middlewares/authMiddleware');

const router = Router();

router.get("/admin/dashboard", authenticate, checkRole("admin"), (req, res) => {
    res.json({
      message: "Bienvenue sur le tableau de bord de l'admin !",
      user: req.user,
    });
});

module.exports = router;