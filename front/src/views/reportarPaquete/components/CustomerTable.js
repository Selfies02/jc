import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import { CFormInput, CPagination, CPaginationItem } from '@coreui/react'
import AddPackageModal from './AddPackageModal'
import { toast } from 'react-hot-toast'

const CustomerTable = ({
  filteredCustomers,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  searchTerm,
  setSearchTerm,
}) => {
  const [visible, setVisible] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [fullName, setFullName] = useState('')
  const [virtualLockers, setVirtualLockers] = useState([])
  const [lockerMapping, setLockerMapping] = useState({})
  const [selectedLocker, setSelectedLocker] = useState('')
  const [codCustomer, setCodCustomer] = useState(null)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)

  const groupedCustomers = useMemo(() => {
    const grouped = filteredCustomers.reduce((acc, customer) => {
      const { COD_CUSTOMER, COD_VIRTUAL_LOCKER_CODE, COD_LOCKER } = customer
      if (!acc[COD_CUSTOMER]) {
        acc[COD_CUSTOMER] = {
          ...customer,
          normalLockers: [],
          expressLockers: [],
          lockerMapping: {},
        }
      }
      if (COD_VIRTUAL_LOCKER_CODE.startsWith('JTC')) {
        acc[COD_CUSTOMER].normalLockers.push(COD_VIRTUAL_LOCKER_CODE)
      } else if (COD_VIRTUAL_LOCKER_CODE.startsWith('JTXC')) {
        acc[COD_CUSTOMER].expressLockers.push(COD_VIRTUAL_LOCKER_CODE)
      }
      acc[COD_CUSTOMER].lockerMapping[COD_VIRTUAL_LOCKER_CODE] = COD_LOCKER
      return acc
    }, {})
    return Object.values(grouped)
  }, [filteredCustomers])

  const openModal = (customer) => {
    if (!customer.COD_CUSTOMER) {
      toast.error('Código de cliente no disponible.')
      return
    }
    const fullName = `${customer.FIRSTNAME} ${customer.MIDDLENAME || ''} ${customer.LASTNAME}`

    setFullName(fullName.trim())
    setVirtualLockers([...customer.normalLockers, ...customer.expressLockers])
    setLockerMapping(customer.lockerMapping)
    setSelectedLocker('')
    setTrackingNumber('')
    setCodCustomer(customer.COD_CUSTOMER)
    setVisible(true)
  }

  const visiblePages = []
  const maxVisiblePages = 10
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages)

  const adjustedStartPage = Math.max(1, endPage - maxVisiblePages + 1)

  for (let i = adjustedStartPage; i <= endPage; i++) {
    visiblePages.push(i)
  }

  return (
    <div style={{ marginBottom: '40px' }}>
      <div className="d-flex justify-content-between mb-3">
        <CFormInput
          type="text"
          placeholder="Buscar por nombre o código de casillero"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <CTable align="middle" className="mb-0 border-light" hover responsive>
        <CTableHead color="dark">
          <CTableRow>
            <CTableHeaderCell className="text-white">Cliente</CTableHeaderCell>
            <CTableHeaderCell className="text-white">Casillero normal</CTableHeaderCell>
            <CTableHeaderCell className="text-white">Casillero express</CTableHeaderCell>
            <CTableHeaderCell className="text-white">Acciones</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {groupedCustomers.length > 0 ? (
            groupedCustomers.slice(indexOfFirstItem, indexOfLastItem).map((customer, index) => {
              const fullName = `${customer.FIRSTNAME} ${customer.MIDDLENAME || ''} ${customer.LASTNAME}`
              const normalLockers = customer.normalLockers.join(', ') || 'Sin Casilleros Normales'
              const expressLockers = customer.expressLockers.join(', ') || 'Sin Casilleros Express'

              return (
                <CTableRow key={index}>
                  <CTableDataCell>{fullName.trim()}</CTableDataCell>
                  <CTableDataCell>{normalLockers}</CTableDataCell>
                  <CTableDataCell>{expressLockers}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="primary" onClick={() => openModal(customer)}>
                      <CIcon icon={cilPlus} className="me-2" />
                      <span className="d-none d-sm-inline">Agregar paquete</span>
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              )
            })
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="5" className="text-center">
                No se encontraron datos
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

      {totalPages > 0 && (
        <div className="d-flex justify-content-end align-items-center mt-3">
          <CPagination className="justify-content-end">
            <CPaginationItem
              aria-label="Previous"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              style={{ cursor: 'pointer' }}
            >
              <span aria-hidden="true">&raquo;</span>
            </CPaginationItem>
          </CPagination>
        </div>
      )}

      <AddPackageModal
        visible={visible}
        setVisible={setVisible}
        trackingNumber={trackingNumber}
        setTrackingNumber={setTrackingNumber}
        handleAddPackage={(photo) => {
          setVisible(false)
        }}
        fullName={fullName}
        virtualLockers={virtualLockers}
        lockerMapping={lockerMapping}
        selectedLocker={selectedLocker}
        setSelectedLocker={setSelectedLocker}
        codCustomer={codCustomer}
      />
    </div>
  )
}

CustomerTable.propTypes = {
  filteredCustomers: PropTypes.arrayOf(
    PropTypes.shape({
      FIRSTNAME: PropTypes.string.isRequired,
      MIDDLENAME: PropTypes.string,
      LASTNAME: PropTypes.string.isRequired,
      COD_CUSTOMER: PropTypes.number.isRequired,
      COD_VIRTUAL_LOCKER_CODE: PropTypes.string,
      COD_LOCKER: PropTypes.number,
    }),
  ).isRequired,
  currentPage: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
}

export default CustomerTable
