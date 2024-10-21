import api from '../utils/Fetch.js'

export const checkEmail = async (email) => {
  try {
    const response = await api.get(`/email/${email}`)

    if (!response.data.canProceed) {
      return {
        success: false,
        message: 'Correo no válido',
        canProceed: false,
      }
    }

    return response.data
  } catch (error) {
    return {
      success: false,
      message: 'Hubo un error al verificar el email',
      canProceed: false,
    }
  }
}
