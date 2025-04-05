// routes/favoriteRoutes.js
import express from 'express';
import { getUserFavorites } from '../controllers/favoriteController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route protégée : récupère la liste des hôtels favoris de l'utilisateur connecté
router.get('/', authMiddleware, getUserFavorites);

export default router;
