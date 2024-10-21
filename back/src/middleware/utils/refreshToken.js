import jwt from 'jsonwebtoken';
import sequelize from '../../config/database/index.js';

export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
  
    if (!refreshToken) {
      return res.status(403).json({ message: 'Refresh token no proporcionado' });
    }
  
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWTREFRESHSECRET);
  
      const user = await sequelize.query(
        'SELECT * FROM SE_USERS WHERE COD_USER = ?',
        {
          replacements: [decoded.userId],
          type: sequelize.QueryTypes.SELECT
        }
      );
  
      if (!user || user.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      const foundUser = user[0];
  
      const newToken = jwt.sign(
        {
          userId: foundUser.COD_USER,
          roleId: foundUser.COD_ROL,
        },
        process.env.JWTSECRET,
        { expiresIn: '2m' }
      );
  
      const newRefreshToken = jwt.sign(
        {
          userId: foundUser.COD_USER,
          roleId: foundUser.COD_ROL,
        },
        process.env.JWTREFRESHSECRET,
        { expiresIn: '7d' }
      );
  
      await sequelize.query(
        'UPDATE SE_USERS SET API_TOKEN = ? WHERE COD_USER = ?',
        { replacements: [newRefreshToken, foundUser.COD_USER] }
      );

      return res.json({
        token: newToken,
        refreshToken: newRefreshToken
      });
    } catch (error) {
      console.error('Error al refrescar el token:', error);
      return res.status(403).json({ message: 'Refresh token inválido o ha expirado' });
    }
  };
  