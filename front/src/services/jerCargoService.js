import api from '../utils/Fetch.js'

export const getJetCargo = async () => {
  try {
    const response = await api.get('/jetcargo')
    return response.data
  } catch (error) {
    throw new Error('Ocurrió un error al obtener los datos de JetCargo.')
  }
}
