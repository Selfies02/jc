import express from 'express';
import { getAllPrecios, updatePrecio } from '../controllers/PrecioController.js';
import { verifyToken } from '../middleware/utils/verifyToken.js';

const router = express.Router();

router.get('/', verifyToken, getAllPrecios);
router.post('/update', verifyToken, updatePrecio);

export default router;
