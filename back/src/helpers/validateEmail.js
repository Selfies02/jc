const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Función para validar si un correo electrónico tiene un formato válido.
 * @param {string} email - El correo electrónico a validar.
 * @returns {boolean} - Retorna true si el correo tiene un formato válido, de lo contrario retorna false.
 */
export const isValidEmail = (email) => {
    return emailRegex.test(email);
};
