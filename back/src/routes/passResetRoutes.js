import express from 'express';
import { verifyEmailController, resetPasswordController } from '../controllers/PassResetController.js';

const router = express.Router();

router.post('/verify-email', verifyEmailController);

router.post('/reset-password', resetPasswordController);

export default router;