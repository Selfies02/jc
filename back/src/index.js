import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/database/index.js';
import setupAssociations from './models/relaciones/associations.js'
import { createAdminUser } from './seed/InsAdmin.js';

connectDB();

setupAssociations();

createAdminUser();

const portApit = process.env.PORT || 3000;

app.listen(portApit, () => {
  console.log(`Servidor corriendo en el puerto ${portApit}`);
});
