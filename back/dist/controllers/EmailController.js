import sequelize from "../config/database/index.js";
import dotenv from 'dotenv';
import { isValidEmail } from '../helpers/validateEmail.js';
dotenv.config();
export const GetEmail = async (req, res, next) => {
  const {
    EMAIL
  } = req.params;
  if (!isValidEmail(EMAIL)) {
    return res.status(200).json({
      success: true,
      message: 'Si las credenciales son correctas, recibirás un correo.',
      canProceed: false
    });
  }
  try {
    const emailExistsResult = await sequelize.query("CALL GET_EMAIL_EXISTS(:EMAIL)", {
      replacements: {
        EMAIL
      },
      type: sequelize.QueryTypes.RAW
    });
    if (!emailExistsResult || emailExistsResult.length === 0) {
      throw new Error('No se pudo obtener el resultado del procedimiento almacenado');
    }
    const emailExists = emailExistsResult[0].email_exists;
    return res.status(200).json({
      success: true,
      message: 'Si las credenciales son correctas, recibirás un correo.',
      canProceed: emailExists === 0
    });
  } catch (error) {
    const environment = process.env.NODE_ENV || 'development';
    const errorMessage = 'Error interno del servidor';
    if (environment === 'development') {
      console.error("Error al verificar el email:", error);
    } else {
      console.error("Error en GetEmail: ", error.message);
    }
    return res.status(200).json({
      success: true,
      message: 'Si las credenciales son correctas, recibirás un correo.',
      canProceed: false
    });
  }
};