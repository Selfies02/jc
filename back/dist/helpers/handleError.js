import LOG_ERROR from '../models/LogErrors.js'; // Cambiar require a import

export const HttpError = async (req, error) => {
  await LOG_ERROR.create({
    DES_ERROR: `${error.message || error}`,
    HTTP_ERROR: `${req.method} / ${req.baseUrl}`,
    STATUS_ERROR: `Error al momento de procesar la petición - HTTP error ${error.statusCode || 500}`
  });
  return error;
};