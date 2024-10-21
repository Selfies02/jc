import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  insertPackage, 
  getPackageStatus, 
  updatePackageStatus, 
  updatePackageStatusLlegada, 
  getPackageStatusEnBodega, 
  getPackageStatusEnTransito, 
  getPackageStatusListoParaRetirar,
  getPackageCounts
} from '../controllers/PackageController.js';
import { verifyToken } from '../middleware/utils/verifyToken.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../assets/package'));
  },
  filename: function (req, file, cb) {
    cb(null, `${req.body.tracking}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

router.post('/insert-package', upload.single('imagen'), async (req, res) => {
  try {
    const result = await insertPackage(req, res);

    if (!res.headersSent) {
      res.status(200).json({ message: result.message });
    }
  } catch (error) {
    console.error('Error al insertar el paquete:', error);

    if (!res.headersSent) {
      res.status(500).json({ message: 'Error al insertar el paquete.' });
    }
  }
});

router.get('/packageStatus', verifyToken, getPackageStatus);
router.get('/packageStatusEnBodega', verifyToken, getPackageStatusEnBodega);
router.get('/packageStatusEnTransito', verifyToken, getPackageStatusEnTransito);
router.get('/packageStatusListoParaRetirar', verifyToken, getPackageStatusListoParaRetirar);
router.post('/update/packageStatus', verifyToken, updatePackageStatus);
router.post('/update/packageStatusLlegada', verifyToken, updatePackageStatusLlegada);
router.get('/counts', verifyToken, getPackageCounts)

export default router;
