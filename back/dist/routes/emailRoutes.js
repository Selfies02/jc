import express from 'express';
import { GetEmail } from '../controllers/EmailController.js';
const router = express.Router();
router.get('/:EMAIL', GetEmail);
export default router;