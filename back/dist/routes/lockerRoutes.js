// routes/lockerRoutes.js
import express from 'express';
import { getLockers, openVirtualLocker, getLockerPrice } from '../controllers/lockerController.js';
import { verifyToken } from '../middleware/utils/verifyToken.js';
const router = express.Router();
router.get('/:customerId', verifyToken, getLockers);
router.get('/lockerPrice/:codLocker', verifyToken, getLockerPrice);
router.post('/open-locker', verifyToken, openVirtualLocker);
export default router;