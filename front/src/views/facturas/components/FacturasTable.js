import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
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
  CButton,
} from '@coreui/react'
import { getAllCustomers } from '../../../services/customerService'
import FacturasView from './FacturasView'

const FacturasTable = ({ onCustomerSelect, onCloseFacturas }) => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedCustomerName, setSelectedCustomerName] = useState('')
  const itemsPerPage = 12

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true)
      try {
        const data = await getAllCustomers()
        if (Array.isArray(data)) {
          setCustomers(data)
        } else if (typeof data === 'object' && data !== null) {
          const customersArray = Object.values(data)
          setCustomers(customersArray)
        } else {
          throw new Error('Los datos recibidos no tienen el formato esperado')
        }
      } catch (error) {
        toast.error(error.message || 'Error al cargar los clientes. Por favor, intente de nuevo.')
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  const filteredCustomers = useMemo(() => {
    if (!Array.isArray(customers)) {
      toast.error('Los clientes no son un array')
      return []
    }

    return customers.filter((customer) => {
      if (typeof customer !== 'object' || customer === null) {
        toast.error('El cliente no es válido')
        return false
      }

      const fullName =
        `${customer.FIRSTNAME || ''} ${customer.MIDDLENAME || ''} ${customer.LASTNAME || ''}`.toLowerCase()

      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        (customer.EMAIL && customer.EMAIL.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.COD_CUSTOMER && customer.COD_CUSTOMER.toString().includes(searchTerm))
      )
    })
  }, [customers, searchTerm])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)

  const handleViewFacturas = (customer) => {
    const fullName =
      `${customer.FIRSTNAME || ''} ${customer.MIDDLENAME || ''} ${customer.LASTNAME || ''}`.trim()
    setSelectedCustomer(customer.COD_CUSTOMER)
    setSelectedCustomerName(fullName)
    onCustomerSelect(fullName)
  }

  const handleCloseFacturas = () => {
    setSelectedCustomer(null)
    setSelectedCustomerName('')
    onCloseFacturas()
  }

  if (loading) {
    return <CSpinner color="primary" />
  }

  if (error) {
    return <div className="text-center text-danger">{error}</div>
  }

  if (selectedCustomer !== null) {
    return (
      <FacturasView
        codCustomer={selectedCustomer}
        customerName={selectedCustomerName}
        onClose={handleCloseFacturas}
      />
    )
  }

  // Paginación
  const visiblePages = []
  const maxVisiblePages = 10
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages)

  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i)
  }

  return (
    <div>
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
            <CTableHeaderCell className="text-white">Cliente</CTableHeaderCell>
            <CTableHeaderCell className="text-white">Email</CTableHeaderCell>
            <CTableHeaderCell className="text-white">Acciones</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentCustomers.length > 0 ? (
            currentCustomers.map((customer, index) => {
              const fullName =
                `${customer.FIRSTNAME || ''} ${customer.MIDDLENAME || ''} ${customer.LASTNAME || ''}`.trim()

              return (
                <CTableRow key={index}>
                  <CTableDataCell>{fullName || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{customer.EMAIL || 'N/A'}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="primary" size="sm" onClick={() => handleViewFacturas(customer)}>
                      Ver pre-facturas
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
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
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
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              <span aria-hidden="true">&raquo;</span>
            </CPaginationItem>
          </CPagination>
        </div>
      )}
    </div>
  )
}

FacturasTable.propTypes = {
  onCustomerSelect: PropTypes.func.isRequired,
  onCloseFacturas: PropTypes.func.isRequired,
}

export default FacturasTable
