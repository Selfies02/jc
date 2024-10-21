import rateLimit from 'express-rate-limit';

const signupLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 8,
    message: 'Demasiadas cuentas creadas desde esta IP. Intenta nuevamente después de 15 minutos.',
    standardHeaders: true,
    legacyHeaders: false,
});

export default signupLimiter;
