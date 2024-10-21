import api from '../utils/Fetch.js'

export const CountryService = async () => {
  try {
    const response = await api.get('/country/')

    if (response.data && response.data.ok && Array.isArray(response.data.Countries)) {
      return response.data.Countries
    } else {
      throw new Error('Formato de respuesta inesperado')
    }
  } catch (error) {
    throw new Error('Error al obtener los países. Por favor, intente de nuevo.')
  }
}

export const StateService = async (COD_COUNTRY) => {
  try {
    const response = await api.get(`/state/country/${COD_COUNTRY}`)

    if (response.data && response.data.ok && Array.isArray(response.data.States)) {
      return response.data.States
    } else {
      throw new Error('Formato de respuesta inesperado')
    }
  } catch (error) {
    throw new Error('Error al obtener los estados. Por favor, intente de nuevo.')
  }
}

export const CityService = async (COD_STATE) => {
  try {
    const response = await api.get(`/city/state/${COD_STATE}`)

    if (response.data && response.data.ok && Array.isArray(response.data.city)) {
      return response.data.city
    } else {
      throw new Error('Formato de respuesta inesperado')
    }
  } catch (error) {
    throw new Error('Error al obtener las ciudades. Por favor, intente de nuevo.')
  }
}
