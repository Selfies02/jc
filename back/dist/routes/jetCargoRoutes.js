import express from 'express';
import { getJetCargo } from '../controllers/JetCargoController.js';
import { verifyToken } from '../middleware/utils/verifyToken.js';
const router = express.Router();
router.get('/', verifyToken, getJetCargo);
export default router;