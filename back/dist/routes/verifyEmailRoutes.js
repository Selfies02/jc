import express from 'express';
import { verifyEmail } from '../middleware/verify.js';
const router = express.Router();
router.get('/email', verifyEmail);
export default router;