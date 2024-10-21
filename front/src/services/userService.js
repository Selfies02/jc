import api from '../utils/Fetch.js'

export const getUserDetails = async (cod_user) => {
  try {
    const response = await api.get(`/user/${cod_user}`)
    return response.data
  } catch (error) {
    throw new Error('Ocurrio un error al obtener los datos del usuario')
  }
}

export const changePasswordService = async (data) => {
  try {
    const response = await api.post('/user/change-password', data)
    return response.data
  } catch (error) {
    throw new Error('Error al intentar cambiar la contraseña. Por favor, inténtalo de nuevo.')
  }
}

export const updateUserDetails = async (userDetails) => {
  try {
    const response = await api.post('/user/update', userDetails)
    return response.data
  } catch (error) {
    throw new Error('Ocurrio un error al actualizar los datos del usuario')
  }
}
