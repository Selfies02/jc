import api from '../utils/Fetch.js'

export const sendResetEmail = async (email) => {
  try {
    const response = await api.post('/passReset/verify-email', { email })
    return response.data
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error('Error al enviar el correo de verificación')
  }
}

export const resetPassword = async (cod_user, new_password, usr_upd) => {
  try {
    const response = await api.post('/passReset/reset-password', {
      cod_user,
      new_password,
      usr_upd,
    })
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error al restablecer la contraseña')
  }
}
