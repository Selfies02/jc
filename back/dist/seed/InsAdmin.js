// Importa tu conexión de Sequelize
import sequelize from '../config/database/index.js';
import bcryptjs from 'bcryptjs';
export const createAdminUser = async () => {
  try {
    const hashedPassword = await bcryptjs.hash('adminpassword', 10);
    const [results] = await sequelize.query("SELECT COUNT(*) AS adminExists FROM SE_USERS U JOIN PA_PEOPLE P ON U.COD_PEOPLE = P.COD_PEOPLE WHERE P.FIRSTNAME = 'Administrador';");
    if (results[0].adminExists === 0) {
      await sequelize.query(`CALL INS_USER_ADMIN(
          :p_ID, :p_TIP_DOCUMENT, :p_FIRSTNAME, :p_MIDDLENAME, :p_LASTNAME, :p_AGE, :p_DAT_BIRTH, :p_USR_ADD,
          :p_PAS_USER, :p_COD_ROL, :p_NUM_AREA, :p_NUM_PHONE, :p_EMAIL,
          :p_COD_COUNTRY, :p_COD_STATE, :p_COD_CITY, :p_DES_ADDRESS
        )`, {
        replacements: {
          p_ID: '0000-0000-00000',
          p_TIP_DOCUMENT: 'ID',
          p_FIRSTNAME: 'Administrador',
          p_MIDDLENAME: 'del',
          p_LASTNAME: 'sistema',
          p_AGE: '28',
          p_DAT_BIRTH: new Date('1996-01-01'),
          p_USR_ADD: 'System',
          p_PAS_USER: hashedPassword,
          p_COD_ROL: 1,
          p_NUM_AREA: '+504',
          p_NUM_PHONE: '9999-9999',
          p_EMAIL: 'admin@example.com',
          p_COD_COUNTRY: 1,
          p_COD_STATE: 8,
          p_COD_CITY: 90,
          p_DES_ADDRESS: 'Dirección del administrador'
        }
      });
      console.log('Administrador creado exitosamente.');
    } else {
      console.log('El administrador ya existe.');
    }
  } catch (error) {
    console.error('Error al crear el administrador:', error);
  }
};