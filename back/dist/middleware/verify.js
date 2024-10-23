import SeUsers from '../models/SeUsers.js';
import PaEmails from '../models/PaEmails.js';
import PaPeople from '../models/PaPeople.js';
import jwt from 'jsonwebtoken';

// Clave secreta del JWT
const JWTSECRET = process.env.JWTSECRET || 'your_jwt_secret_key';
const FRONT_URL = `${process.env.API_FRONT}`;
export const verifyEmail = async (req, res) => {
  const {
    token
  } = req.query;

  // Validación del token
  if (!token) {
    return res.redirect(`${FRONT_URL}/verify-failed?error=Token no proporcionado`);
  }
  try {
    const decoded = jwt.verify(token, JWTSECRET, {
      algorithms: ['HS256']
    });
    const {
      email,
      id
    } = decoded;
    const emailRecord = await PaEmails.findOne({
      where: {
        EMAIL: email
      }
    });
    if (!emailRecord) {
      return res.redirect(`${FRONT_URL}/verify-failed?error=Correo no encontrado`);
    }
    const {
      COD_PEOPLE
    } = emailRecord;
    const personRecord = await PaPeople.findOne({
      where: {
        COD_PEOPLE
      }
    });
    if (!personRecord) {
      return res.redirect(`${FRONT_URL}/verify-failed?error=Persona no encontrada`);
    }
    const userRecord = await SeUsers.findOne({
      where: {
        COD_PEOPLE,
        COD_USER: id
      }
    });
    if (!userRecord) {
      return res.redirect(`${FRONT_URL}/verify-failed?error=Usuario no encontrado`);
    }
    if (!userRecord.EMAIL_VERIFIED) {
      await SeUsers.update({
        EMAIL_VERIFIED: true
      }, {
        where: {
          COD_USER: id
        }
      });
      return res.redirect(`${FRONT_URL}/verify-success`);
    }
    return res.redirect(`${FRONT_URL}/verify-success?message=Correo ya verificado`);
  } catch (error) {
    return res.redirect(`${FRONT_URL}/verify-failed?error=Token inválido o expirado`);
  }
};