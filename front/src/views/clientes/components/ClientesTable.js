import React, { useState, useEffect, useMemo } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormInput,
  CPagination,
  CPaginationItem,
  CSpinner,
  CBadge,
  CButton,
  CAlert,
} from '@coreui/react'
import { cilPencil } from '@coreui/icons'
import { getCustomersWithStateAndType } from '../../../services/customerService'
import UpdModalClientes from './UpdModalCliente'
import CIcon from '@coreui/icons-react'

const ClientesTable = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 10
  const [selectedClient, setSelectedClient] = useState(null)

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const data = await getCustomersWithStateAndType()
      setCustomers(data)
    } catch (error) {
      setError('No hay clientes todavía')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const fullName =
        `${customer.FIRSTNAME || ''} ${customer.MIDDLENAME || ''} ${customer.LASTNAME || ''}`.toLowerCase()
      return fullName.includes(searchTerm.toLowerCase())
    })
  }, [customers, searchTerm])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)

  const visiblePages = []
  const maxVisiblePages = 10
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages)

  const adjustedStartPage = Math.max(1, endPage - maxVisiblePages + 1)

  for (let i = adjustedStartPage; i <= endPage; i++) {
    visiblePages.push(i)
  }

  const getCustomerType = (type) => {
    switch (type) {
      case 'N':
        return 'Natural'
      case 'E':
        return 'Emprendedor'
      default:
        return 'Desconocido'
    }
  }

  const handleEditClick = (customer) => {
    setSelectedClient(customer)
  }

  const handleCloseModal = () => {
    setSelectedClient(null)
  }

  const handleUpdateCustomer = async () => {
    await fetchCustomers()
    handleCloseModal()
  }

  if (loading) {
    return (
      <div className="text-center mt-5">
        <CSpinner color="primary" />
        <p>Cargando...</p>
      </div>
    )
  }
  if (error) {
    return <CAlert color="warning">{error}</CAlert>
  }

  return (
    <div style={{ marginBottom: '40px' }}>
      <div className="d-flex justify-content-between mb-3">
        <CFormInput
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <CTable align="middle" className="mb-0 border-light" hover responsive>
        <CTableHead color="dark">
          <CTableRow>
            <CTableHeaderCell className="text-white">Nombre</CTableHeaderCell>
            <CTableHeaderCell className="text-white text-center">Tipo de cliente</CTableHeaderCell>
            <CTableHeaderCell className="text-white text-center">
              Estado del cliente
            </CTableHeaderCell>
            <CTableHeaderCell className="text-white text-center">Acciones</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentCustomers.length > 0 ? (
            currentCustomers.map((customer, index) => {
              const fullName =
                `${customer.FIRSTNAME || ''} ${customer.MIDDLENAME || ''} ${customer.LASTNAME || ''}`.trim()
              const isActive =
                customer.IND_USR === 1 || customer.IND_USR === '1' || customer.IND_USR === true

              return (
                <CTableRow key={index}>
                  <CTableDataCell>{fullName || 'N/A'}</CTableDataCell>
                  <CTableDataCell className="text-center">
                    {getCustomerType(customer.IND_TYPCUST)}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CBadge color={isActive ? 'success' : 'danger'}>
                      {isActive ? 'Activo' : 'Inactivo'}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CButton color="primary" onClick={() => handleEditClick(customer)}>
                      <CIcon icon={cilPencil} className="me-2" />
                      Editar
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              )
            })
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="4" className="text-center">
                No se encontraron datos
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
      {totalPages > 0 && (
        <div className="d-flex justify-content-end align-items-center mt-3">
          <CPagination>
            <CPaginationItem
              aria-label="Previous"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              style={{ cursor: 'pointer' }}
            >
              <span aria-hidden="true">&laquo;</span>
            </CPaginationItem>
            {visiblePages.map((page) => (
              <CPaginationItem
                key={page}
                active={currentPage === page}
                onClick={() => setCurrentPage(page)}
                style={{ cursor: 'pointer' }}
              >
                {page}
              </CPaginationItem>
            ))}
            <CPaginationItem
              aria-label="Next"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              style={{ cursor: 'pointer' }}
            >
              <span aria-hidden="true">&raquo;</span>
            </CPaginationItem>
          </CPagination>
        </div>
      )}
      <UpdModalClientes
        client={selectedClient}
        onClose={handleCloseModal}
        onUpdate={handleUpdateCustomer}
      />
    </div>
  )
}

export default ClientesTable
