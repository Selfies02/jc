import express from 'express';
import { signIn } from '../controllers/AuthController.js';
import { refreshToken } from '../middleware/utils/refreshToken.js';

const router = express.Router();

router.post('/signin', signIn);
router.post('/refresh-token', refreshToken);

export default router;
