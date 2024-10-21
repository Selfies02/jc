import express from 'express';
import { GetCityForState } from '../controllers/CityControlles.js   ';

const router = express.Router();

router.get('/state/:COD_STATE', GetCityForState);

export default router;
