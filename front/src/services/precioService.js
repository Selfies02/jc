import api from '../utils/Fetch.js'

export const getAllPrecios = async () => {
  try {
    const response = await api.get('/precio')

    if (response.data.success) {
      return response.data.data
    } else {
      throw new Error('No se pudo obtener los precios')
    }
  } catch (error) {
    throw new Error('Ocurrió un error al obtener los precios')
  }
}

export const updatePrecio = async (cod_precio, precio, usr_upd) => {
  try {
    const body = {
      p_cod_precio: cod_precio,
      p_precio: precio,
      p_usr_upd: usr_upd,
    }

    const response = await api.post('/precio/update', body)

    return response.data
  } catch (error) {
    throw new Error('Error al actualizar el precio')
  }
}
