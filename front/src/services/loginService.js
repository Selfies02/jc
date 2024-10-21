import api from '../utils/Fetch'

export const loginService = async ({ email, password }) => {
  try {
    const response = await api.post('/auth/signin', {
      email,
      password,
    })

    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al iniciar sesión')
  }
}
