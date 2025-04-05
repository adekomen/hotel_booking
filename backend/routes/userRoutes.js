import express from 'express';
import { updateUserProfile, deleteUserProfile } from '../controllers/userController.js';
import {authMiddleware } from '../middleware/authMiddleware.js'; // Middleware pour vérifier le JWT

const router = express.Router();

router.put('/profile', authMiddleware, updateUserProfile);
router.delete('/profile', authMiddleware, deleteUserProfile);

export default router;
