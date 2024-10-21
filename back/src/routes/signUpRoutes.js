import express from 'express';
import { SignUp } from '../controllers/SingUpController.js';
import signupLimiter from '../middleware/rateLimit.js';

const router = express.Router();

router.post('/', signupLimiter, SignUp);

export default router;
