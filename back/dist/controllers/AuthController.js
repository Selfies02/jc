import jwt from 'jsonwebtoken';
import PaPeople from '../models/PaPeople.js';
import PaPhones from '../models/PaPhones.js';
import sequelize from '../config/database/index.js';
import { comparePassword } from '../helpers/bcrypt.js';
export const signIn = async (req, res) => {
  const {
    email,
    password
  } = req.body;
  try {
    const user = await sequelize.query('SELECT * FROM SE_USERS WHERE EMAIL = ?', {
      replacements: [email],
      type: sequelize.QueryTypes.SELECT
    });
    if (!user || user.length === 0) {
      return res.status(404).json({
        message: 'Credenciales incorrectas'
      });
    }
    const foundUser = user[0];
    if (foundUser.EMAIL_VERIFIED === 0) {
      return res.status(403).json({
        message: 'Correo no verificado. Por favor, verifica tu correo.'
      });
    }
    if (foundUser.IND_USR === 0) {
      return res.status(403).json({
        message: 'Tu usuario está inactivo.'
      });
    }
    if (foundUser.IND_INS === 0) {
      return res.status(403).json({
        message: 'Tu institución está inactiva.'
      });
    }
    const isPasswordValid = await comparePassword(password, foundUser.PAS_USER);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Credenciales incorrectas'
      });
    }
    const person = await PaPeople.findOne({
      where: {
        COD_PEOPLE: foundUser.COD_PEOPLE
      },
      include: [{
        model: PaPhones
      }]
    });
    if (!person) {
      return res.status(404).json({
        message: 'No se encontró la información de la persona asociada al usuario'
      });
    }
    const permissions = await sequelize.query('CALL GET_ROL_OBJETOS_PERMISOS_FOR_USER(?)', {
      replacements: [foundUser.COD_USER]
    });
    const formattedPermissions = Array.isArray(permissions) ? permissions.map(permission => ({
      object: permission.objectName,
      canInsert: permission.canInsert,
      canDelete: permission.canDelete,
      canUpdate: permission.canUpdate,
      canView: permission.canView,
      canReport: permission.canReport
    })) : [];
    const roleName = permissions.length > 0 ? permissions[0].roleName : 'Sin rol asignado';
    let foundCustomer = null;
    if (roleName !== 'ADMINISTRADOR') {
      const customer = await sequelize.query('SELECT COD_CUSTOMER FROM LO_CUSTOMERS WHERE COD_USER = ?', {
        replacements: [foundUser.COD_USER],
        type: sequelize.QueryTypes.SELECT
      });
      if (!customer || customer.length === 0) {
        return res.status(404).json({
          message: 'No se encontró el cliente asociado a este usuario'
        });
      }
      foundCustomer = customer[0].COD_CUSTOMER;
    }
    const token = jwt.sign({
      userId: foundUser.COD_USER,
      roleId: foundUser.COD_ROL,
      customerId: foundCustomer
    }, process.env.JWTSECRET, {
      expiresIn: '2m'
    });
    const refreshToken = jwt.sign({
      userId: foundUser.COD_USER,
      roleId: foundUser.COD_ROL,
      customerId: foundCustomer
    }, process.env.JWTREFRESHSECRET, {
      expiresIn: '7d'
    });
    await sequelize.query('UPDATE SE_USERS SET API_TOKEN = ? WHERE COD_USER = ?', {
      replacements: [refreshToken, foundUser.COD_USER]
    });
    return res.json({
      token,
      refreshToken,
      user: {
        id: foundUser.COD_USER,
        firstName: person.FIRSTNAME,
        lastName: person.LASTNAME,
        email: foundUser.EMAIL,
        phone: person.PaPhones?.[0]?.dataValues?.NUM_PHONE,
        role: roleName,
        customerId: foundCustomer,
        permissions: formattedPermissions
      }
    });
  } catch (error) {
    console.error('Error en el servidor:', error);
    return res.status(500).json({
      message: 'Error en el servidor'
    });
  }
};