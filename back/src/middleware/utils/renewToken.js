import jwt from 'jsonwebtoken';

export const renewToken = (token, secretKey, expiresIn) => {
  try {
    const decoded = jwt.verify(token, secretKey);

    const newToken = jwt.sign({ ...decoded }, secretKey, { expiresIn });

    return { valid: true, newToken, decoded };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.error('El token ha expirado y no puede ser renovado');
      return { valid: false, message: 'Token expirado. Necesitas autenticación.' };
    } else {
      console.error('Token inválido');
      return { valid: false, message: 'Token inválido' };
    }
  }
};
