import api from '../utils/Fetch.js'

export const insertInvoiceAndCharges = async (invoiceData, pdfFile) => {
  try {
    const formData = new FormData()
    formData.append('invoiceData', JSON.stringify(invoiceData))

    if (pdfFile) {
      const fileName = pdfFile.name || 'factura.pdf'
      formData.append('pdfFile', pdfFile, fileName)
    }

    const response = await api.post('/invoice/invoiceAndCharges', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  } catch (error) {
    throw new Error('Error al insertar la factura y cargos. Por favor, inténtalo de nuevo.')
  }
}

export const getInvoiceTotals = async (period) => {
  try {
    const response = await api.get(`/invoice/invoiceTotals${period ? `?period=${period}` : ''}`)
    return response.data
  } catch (error) {
    throw new Error('Ocurrió un error al obtener el total de las facturas')
  }
}

export const getInvoiceNumber = async () => {
  try {
    const response = await api.get('/invoice/invoiceNumber')
    return response.data
  } catch (error) {
    throw new Error('Ocurrió un error al obtener el número de factura')
  }
}

export const getInvoiceDetailsByCustomer = async (codCustomer) => {
  try {
    const response = await api.get(`/invoice/customerInvoices/${codCustomer}`)
    return response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return {
        message: error.response.data.message || 'No hay facturas para este cliente todavía',
      }
    } else {
      throw new Error('Ocurrió un error al obtener los detalles de las facturas')
    }
  }
}
