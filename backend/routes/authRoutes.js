import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { validateRegister } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.post('/register', registerUser,validateRegister);
router.post('/login', loginUser);

export default router;
