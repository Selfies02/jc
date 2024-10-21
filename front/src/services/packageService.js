import api from '../utils/Fetch.js'

export const insertPackage = async (formData) => {
  try {
    const response = await api.post('/package/insert-package', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  } catch (error) {
    throw new Error('Ocurrió un error al insertar el paquete')
  }
}

export const getCustomerPackageStatus = async () => {
  try {
    const response = await api.get(`/package/packageStatus`)
    return response.data
  } catch (error) {
    throw new Error('No se pudo obtener la lista de paquetes')
  }
}

export const getCustomerPackageStatusEnBodega = async () => {
  try {
    const response = await api.get(`/package/packageStatusEnBodega`)
    return response.data
  } catch (error) {
    throw new Error('No se pudo obtener la lista de paquetes en bodega')
  }
}

export const getCustomerPackageStatusEnTransito = async () => {
  try {
    const response = await api.get(`/package/packageStatusEnTransito`)
    return response.data
  } catch (error) {
    throw new Error('Error al obtener los paquetes del cliente. Por favor, intente de nuevo.')
  }
}

export const getCustomerPackageStatusListoParaRetirar = async () => {
  try {
    const response = await api.get(`/package/packageStatusListoParaRetirar`)
    return response.data
  } catch (error) {
    throw new Error('Ocurrió un error al obtener los paquetes del cliente.')
  }
}

export const updatePackageStatus = async (formData) => {
  try {
    const { cod_locker } = formData
    if (!cod_locker) {
      throw new Error('El campo cod_locker es requerido.')
    }

    const response = await api.post('/package/update/packageStatus', { cod_locker })

    return response.data
  } catch (error) {
    throw new Error('Ocurrio un error al actualizar el estado del paquete en bodega')
  }
}

export const updatePackageStatusLlegada = async (formData) => {
  try {
    const { cod_locker } = formData
    if (!cod_locker) {
      throw new Error('El campo cod_locker es requerido.')
    }

    const response = await api.post('/package/update/packageStatusLlegada', { cod_locker })

    return response.data
  } catch (error) {
    throw new Error('Ocurrio un error al actualizar el estado del paquete en transito')
  }
}

export const getPackageCounts = async () => {
  try {
    const response = await api.get('/package/counts')

    if (response.data && response.data.ok && Array.isArray(response.data.packageCounts)) {
      return { ok: true, packageCounts: response.data.packageCounts }
    } else {
      return { ok: false, message: 'Formato de respuesta inesperado' }
    }
  } catch (error) {
    return { ok: false, message: 'Error al obtener los conteos de paquetes' }
  }
}
