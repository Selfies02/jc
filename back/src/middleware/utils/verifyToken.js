import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({
      success: false,
      message: 'No token provided or wrong format.',
    });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Token is not valid.',
      });
    }

    req.userId = decoded.userId;

    next();
  });
};
