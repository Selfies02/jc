import express, { json, urlencoded } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import countryRoutes from './routes/countryRoutes.js';
import stateRoutes from './routes/stateRoutes.js';
import cityRoutes from './routes/cityRoute.js';
import signUpRoutes from './routes/signUpRoutes.js';
import verifyEmailRoutes from './routes/verifyEmailRoutes.js';
import lockerRoutes from './routes/lockerRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import packageRoutes from './routes/packageRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import passResetRoutes from './routes/passResetRoutes.js';
import jetCargoRoutes from './routes/jetCargoRoutes.js';
import userRoutes from './routes/userRoutes.js'
import precioRoutes from './routes/preciosRoutes.js'
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/signUp', signUpRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/country', countryRoutes);
app.use('/api/state', stateRoutes);
app.use('/api/city', cityRoutes);
app.use('/api/verify', verifyEmailRoutes);
app.use('/api/locker', lockerRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/package', packageRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/passReset', passResetRoutes);
app.use('/api/jetcargo', jetCargoRoutes);
app.use('/api/user', userRoutes);
app.use('/api/precio', precioRoutes);

app.use('/assets/facturas', express.static(path.join(__dirname, 'assets/facturas')));

app.use('/assets/package', express.static(path.join(__dirname, 'assets/package')));

export default app;