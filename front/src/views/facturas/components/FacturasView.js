import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CTable,
  CTableRow,
  CTableBody,
  CTableDataCell,
  CSpinner,
  CButton,
  CPagination,
  CPaginationItem,
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CRow,
  CCol,
  CFormCheck,
  CAlert,
} from '@coreui/react'
import { getInvoiceDetailsByCustomer } from '../../../services/invoiceService'
import { toast } from 'react-hot-toast'
import config from '../../../config'

const fullBackendUrl = config.getFullBackendUrl()

const FacturasView = ({ codCustomer, onClose }) => {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPdf, setSelectedPdf] = useState(null)
  const [selectedInvoiceIndex, setSelectedInvoiceIndex] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const itemsPerPage = 12

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await getInvoiceDetailsByCustomer(codCustomer)
        if (Array.isArray(data)) {
          const uniqueInvoices = data.reduce((acc, current) => {
            const x = acc.find((item) => item.NUM_INVOICE === current.NUM_INVOICE)
            if (!x) {
              return acc.concat([current])
            } else {
              return acc
            }
          }, [])
          setInvoices(uniqueInvoices)
        } else {
          toast.error(data.message || 'No se encontraron facturas para el cliente especificado.')
        }
        setLoading(false)
      } catch (error) {
        toast.error('Error al cargar las facturas. Por favor, intente de nuevo.')
        setLoading(false)
      }
    }

    fetchInvoices()

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [codCustomer])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentInvoices = invoices.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(invoices.length / itemsPerPage)

  const handlePdfSelect = (index, ruta) => {
    if (selectedInvoiceIndex === index) {
      setSelectedPdf(null)
      setSelectedInvoiceIndex(null)
    } else {
      setSelectedPdf(`${fullBackendUrl}/${ruta}`)
      setSelectedInvoiceIndex(index)
    }
  }

  if (loading) {
    return <CSpinner color="primary" />
  }

  if (error) {
    return <div className="text-center text-danger">{error}</div>
  }

  return (
    <CContainer fluid>
      <CRow>
        <CCol xs={12} md={5} lg={4}>
          <CCard className="mb-3">
            <CCardHeader>Lista de PDFs</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border-light" hover responsive>
                <CTableBody>
                  {currentInvoices.length > 0 ? (
                    currentInvoices.map((invoice, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>
                          <div className="d-flex align-items-center">
                            <CFormCheck
                              checked={selectedInvoiceIndex === index}
                              onChange={() => handlePdfSelect(index, invoice.RUTA)}
                              disabled={!invoice.RUTA || invoice.RUTA === 'N/A'}
                            />
                            {invoice.RUTA ? (
                              <CButton
                                color="primary"
                                size="sm"
                                className="w-100 mt-1 ms-2"
                                onClick={() => handlePdfSelect(index, invoice.RUTA)}
                              >
                                Ver factura {invoice.NUM_INVOICE}
                              </CButton>
                            ) : (
                              'N/A'
                            )}
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell className="text-center">
                        No se encontraron facturas
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
              {totalPages > 0 && (
                <CPagination className="mt-3">
                  <CPaginationItem
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Anterior
                  </CPaginationItem>
                  <CPaginationItem disabled>
                    {currentPage} de {totalPages}
                  </CPaginationItem>
                  <CPaginationItem
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Siguiente
                  </CPaginationItem>
                </CPagination>
              )}
              <div className="mt-3">
                <CButton color="secondary" onClick={onClose}>
                  Volver
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={7} lg={8}>
          <CCard className="mb-3">
            <CCardHeader>Visualizador de PDF</CCardHeader>
            <CCardBody>
              {selectedPdf ? (
                isMobile ? (
                  <div>
                    <CAlert color="info">
                      El PDF no se puede mostrar en este dispositivo. Por favor, descargue el
                      archivo para verlo.
                    </CAlert>
                    <CButton color="primary" onClick={() => window.open(selectedPdf, '_blank')}>
                      Descargar PDF
                    </CButton>
                  </div>
                ) : (
                  <div style={{ width: '100%', height: '60.7vh', overflow: 'hidden' }}>
                    <iframe
                      src={selectedPdf}
                      width="100%"
                      height="100%"
                      style={{ border: 'none' }}
                      title="PDF Viewer"
                    />
                  </div>
                )
              ) : (
                <div className="text-center">Seleccione un PDF para visualizar</div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

FacturasView.propTypes = {
  codCustomer: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default FacturasView
