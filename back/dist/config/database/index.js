import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
const sequelize = new Sequelize(process.env.DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.HOST,
  dialect: 'mysql',
  port: process.env.PORT_DB || 3306,
  logging: false
});
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos exitosa');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    throw new Error('No se pudo conectar a la base de datos');
  }
};
export default sequelize;