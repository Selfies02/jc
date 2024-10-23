import express from 'express';
import { GetStatesForCountry } from '../controllers/StateController.js';
const router = express.Router();
router.get('/country/:COD_COUNTRY', GetStatesForCountry);
export default router;