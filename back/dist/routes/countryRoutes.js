import express from 'express';
import { GetCountries } from '../controllers/CountryControler.js';
const router = express.Router();
router.get('/', GetCountries);
export default router;