import api from '../utils/Fetch.js'

export const getLockers = async (customerId) => {
  try {
    const response = await api.get(`/locker/${customerId}`)
    return response.data
  } catch (error) {
    throw new Error('No se pudo obtener la lista de lockers')
  }
}

export const openVirtualLocker = async (cod_customer, cod_locker) => {
  try {
    const response = await api.post('locker/open-locker', {
      cod_customer,
      cod_locker,
    })

    return response.data
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || 'Error abriendo el casillero'
    return { success: false, message: errorMessage } // Devolver el mensaje de error al frontend
  }
}

// export const getLockerPriceService = async (codLocker) => {
//   try {
//     const response = await api.get(`/locker/lockerPrice/${codLocker}`)

//     if (response.data && response.data.ok && !isNaN(response.data.price)) {
//       const price = parseFloat(response.data.price)
//       return price
//     } else {
//       console.error('Formato de respuesta inesperado:', response.data)
//       return null
//     }
//   } catch (error) {
//     console.error('Error al obtener el precio del locker:', error)
//     throw error
//   }
// }
