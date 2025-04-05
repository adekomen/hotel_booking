// routes/bookingRoutes.js
import express from 'express';
import { getUserBookings } from '../controllers/bookingController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';  // Vérifie l'authentification

const router = express.Router();

// Route protégée : récupère l'historique des réservations de l'utilisateur connecté
router.get('/history', authMiddleware, getUserBookings);

export default router;
