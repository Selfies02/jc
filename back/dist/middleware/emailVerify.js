import PaEmails from '../models/PaEmails.js'; // Importa el modelo de PA_EMAILS
import { Op } from 'sequelize';
export const isEmailRegistered = async email => {
  try {
    const emailRecord = await PaEmails.findOne({
      where: {
        USEREMAIL: {
          [Op.eq]: email
        }
      }
    });
    return emailRecord ? true : false;
  } catch (error) {
    console.error('Error al verificar el correo:', error);
    throw new Error('Error al verificar el correo');
  }
};