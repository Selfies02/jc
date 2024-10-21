import api from '../utils/Fetch'

export const getUserPermissions = async () => {
  try {
    const response = await api.get('/auth/permissions')
    return response.data.permissions
  } catch (error) {
    throw new Error('No se pudieron obtener los permisos')
  }
}
