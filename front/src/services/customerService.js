import api from '../utils/Fetch.js'

export const CustomersWithLockersService = async () => {
  try {
    const response = await api.get('customer/customers-lockers')
    return response.data
  } catch (error) {
    throw new Error('No se pudo obtener la lista de clientes con casilleros.')
  }
}

export const getCustomerPackages = async (customerId) => {
  try {
    const response = await api.get(`customer/customer-packages/${customerId}`)
    const data = response.data

    if (!data.ok || data.packages.length === 0) {
      return { message: 'No hay paquetes disponibles todavía.' }
    }

    return data
  } catch (error) {
    return { message: 'Ocurrió un error al obtener los paquetes.' }
  }
}

export const getCustomerAddressAndPhone = async (codCustomer) => {
  try {
    const response = await api.get(`/customer/address-phone/${codCustomer}`)
    return response.data
  } catch (error) {
    throw new Error('Ocurrió un error al obtener la dirección y teléfono del cliente.')
  }
}

export const getAllCustomers = async () => {
  try {
    const response = await api.get('/customer')
    return response.data
  } catch (error) {
    throw new Error('Ocurrió un error al obtener todos los clientes.')
  }
}

export const getCustomersWithStateAndType = async () => {
  try {
    const response = await api.get('/customer/stateAndType')

    if (response.status === 200) {
      return response.data
    } else {
      throw new Error('No se encontraron clientes.')
    }
  } catch (error) {
    throw new Error('Ocurrió un error al obtener la lista de clientes.')
  }
}

export const updateCustomerStateAndTypeService = async (
  codUser,
  newIndUsr,
  newIndTypCust,
  usrUpd,
) => {
  try {
    const response = await api.post('/customer/update/stateAndType', {
      codUser,
      newIndUsr,
      newIndTypCust,
      usrUpd,
    })

    return response.data
  } catch (error) {
    throw new Error('Ocurrió un error al actualizar el estado y tipo del cliente.')
  }
}
