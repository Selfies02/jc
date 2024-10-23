import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';
import PaEmails from '../models/PaEmails.js';
import SeUsers from '../models/SeUsers.js';
import PaPeople from '../models/PaPeople.js';
import { transport, configTransportResetPassword } from '../email/index.js';
import sequelize from '../config/database/index.js';
import { hashPassword } from '../helpers/bcrypt.js';
export const verifyEmailController = async (req, res) => {
  const {
    email
  } = req.body;
  try {
    const emailRecord = await PaEmails.findOne({
      where: {
        EMAIL: email
      },
      include: [{
        model: PaPeople,
        required: true,
        include: [{
          model: SeUsers,
          required: true,
          attributes: ['COD_USER']
        }]
      }]
    });
    if (!emailRecord) {
      return res.status(404).json({
        message: 'Correo electrónico no encontrado'
      });
    }
    const people = emailRecord.PaPerson;
    if (!people || !people.SeUsers || people.SeUsers.length === 0) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }
    const cod_user = people.SeUsers[0].COD_USER;
    const nombre = people.FIRSTNAME;
    const apellido = people.LASTNAME;
    const token = jwt.sign({
      cod_user,
      nombre
    }, process.env.JWTSECRET, {
      expiresIn: '15m'
    });
    const mailOptions = configTransportResetPassword(nombre, apellido, email, token);
    await transport.sendMail(mailOptions);
    res.status(200).json({
      message: 'Correo de verificación enviado'
    });
  } catch (error) {
    console.error('Error en verifyEmailController:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};
export const resetPasswordController = async (req, res) => {
  const {
    cod_user,
    new_password,
    usr_upd
  } = req.body;
  try {
    const hashedPassword = await hashPassword(new_password);
    const result = await sequelize.query('CALL UPD_USER_PASSWORD(:cod_user, :new_password, :usr_upd)', {
      replacements: {
        cod_user,
        new_password: hashedPassword,
        usr_upd
      },
      type: sequelize.QueryTypes.RAW
    });
    if (result && result[0] && result[0].message) {
      const message = result[0].message;
      if (message === 'Contraseña actualizada exitosamente') {
        return res.status(200).json({
          message
        });
      } else {
        return res.status(400).json({
          message
        });
      }
    } else {
      return res.status(500).json({
        message: 'Error desconocido al actualizar la contraseña'
      });
    }
  } catch (error) {
    console.error('Error en resetPasswordController:', error);
    return res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};