import multer from 'multer';
import { resolve } from 'path';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resolve('src/assets/package/'));
  },
  filename: (req, file, cb) => {
    const trackingNumber = req.body.tracking;
    const extension = file.originalname.split('.').pop();
    cb(null, `${trackingNumber}.${extension}`);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('No es un archivo de imagen válido'), false);
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5
  }
});
export default upload;