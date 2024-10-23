import express from 'express';
import { getUserDetails, changePassword, updateUserDetails } from '../controllers/UserController.js';
import { verifyToken } from '../middleware/utils/verifyToken.js';
const router = express.Router();
router.get('/:cod_user', verifyToken, getUserDetails);
router.post('/change-password', verifyToken, changePassword);
router.post('/update', verifyToken, updateUserDetails);
export default router;