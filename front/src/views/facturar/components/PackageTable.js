import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CPagination,
  CPaginationItem,
  CFormInput,
  CButton,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDollar } from '@coreui/icons'
import BillingModal from './BillingModal'
import BillingDetailsModal from './BillingDetailsModal'

const groupPackagesByCustomer = (packages) => {
  const grouped = {}

  packages.forEach((pkg) => {
    if (pkg.ESTADO === 'LISTO PARA RETIRAR' && pkg.INS_CHARGE === 0) {
      const key = pkg.COD_CUSTOMER
      if (!grouped[key]) {
        grouped[key] = {
          firstName: pkg.FIRSTNAME,
          middleName: pkg.MIDDLENAME,
          lastName: pkg.LASTNAME,
          normalPackages: [],
          expressPackages: [],
          estado: 'LISTO PARA RETIRAR',
          cod_customer: pkg.COD_CUSTOMER,
          tip_customer: pkg.IND_TYPCUST,
        }
      }

      const packageInfo = {
        codPaqueteTransito: pkg.COD_PAQUETETRANSITO,
        tracking: pkg.TRACKING,
        codLocker: pkg.COD_LOCKER,
        cod_customer: pkg.COD_CUSTOMER,
      }

      if (pkg.COD_LOCKER === 2) {
        grouped[key].normalPackages.push(packageInfo)
      } else if (pkg.COD_LOCKER === 1) {
        grouped[key].expressPackages.push(packageInfo)
      }
    }
  })

  return Object.values(grouped)
}

const PackageTable = ({
  filteredPackages,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  fetchData,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false)
  const [isBillingDetailsModalOpen, setIsBillingDetailsModalOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [selectedPackageType, setSelectedPackageType] = useState(null)

  const filteredBySearchTerm = filteredPackages.filter((pkg) => {
    const fullName = `${pkg.FIRSTNAME} ${pkg.MIDDLENAME || ''} ${pkg.LASTNAME}`.toLowerCase()
    return fullName.includes(searchTerm.toLowerCase())
  })

  const groupedPackages = groupPackagesByCustomer(filteredBySearchTerm)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = groupedPackages.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(groupedPackages.length / itemsPerPage)

  // Determina el rango de páginas a mostrar
  const visiblePages = []
  const maxVisiblePages = 10 // Número de páginas a mostrar
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages)

  // Ajusta startPage
  const adjustedStartPage = Math.max(1, endPage - maxVisiblePages + 1)

  for (let i = adjustedStartPage; i <= endPage; i++) {
    visiblePages.push(i)
  }

  const handleFacturarClick = (pkg) => {
    setSelectedPackage(pkg)
    setIsBillingModalOpen(true)
  }

  const handleBillingModalConfirm = (type) => {
    setSelectedPackageType(type)
    setIsBillingModalOpen(false)
    setIsBillingDetailsModalOpen(true)
  }

  const handleBillingDetailsConfirm = async (billingDetails) => {
    await fetchData()
    setIsBillingDetailsModalOpen(false)
    setSelectedPackage(null)
    setSelectedPackageType(null)
  }

  return (
    <div style={{ marginBottom: '40px' }}>
      <CFormInput
        type="text"
        placeholder="Buscar por nombre"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />
      <CTable align="middle" className="mb-0 border-light" hover responsive>
        <CTableHead color="dark">
          <CTableRow>
            <CTableHeaderCell className="text-white">Cliente</CTableHeaderCell>
            <CTableHeaderCell className="text-white text-center">Estado</CTableHeaderCell>
            <CTableHeaderCell className="text-white text-center">
              Paquetes normales
            </CTableHeaderCell>
            <CTableHeaderCell className="text-white text-center">Paquetes express</CTableHeaderCell>
            <CTableHeaderCell className="text-white">Acciones</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentItems.map((pkg, index) => (
            <CTableRow key={index}>
              <CTableDataCell>{`${pkg.firstName} ${pkg.middleName || ''} ${pkg.lastName}`}</CTableDataCell>
              <CTableDataCell className="text-center">
                <CBadge color="info">{pkg.estado}</CBadge>
              </CTableDataCell>
              <CTableDataCell className="text-center">{pkg.normalPackages.length}</CTableDataCell>
              <CTableDataCell className="text-center">{pkg.expressPackages.length}</CTableDataCell>
              <CTableDataCell>
                <CButton color="primary" onClick={() => handleFacturarClick(pkg)}>
                  <CIcon icon={cilDollar} /> Facturar
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
      <CPagination className="justify-content-end">
        <CPaginationItem
          aria-label="Previous"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }} // Cambia el cursor
        >
          <span aria-hidden="true">&laquo;</span>
        </CPaginationItem>
        {visiblePages.map((page) => (
          <CPaginationItem
            key={page}
            active={page === currentPage}
            onClick={() => setCurrentPage(page)}
            style={{ cursor: 'pointer' }}
          >
            {page}
          </CPaginationItem>
        ))}
        <CPaginationItem
          aria-label="Next"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
        >
          <span aria-hidden="true">&raquo;</span>
        </CPaginationItem>
      </CPagination>
      <BillingModal
        isOpen={isBillingModalOpen}
        onClose={() => setIsBillingModalOpen(false)}
        onConfirm={handleBillingModalConfirm}
        normalPackages={selectedPackage ? selectedPackage.normalPackages.length : 0}
        expressPackages={selectedPackage ? selectedPackage.expressPackages.length : 0}
        customerName={
          selectedPackage ? `${selectedPackage.firstName} ${selectedPackage.lastName}` : ''
        }
        cod_customer={selectedPackage ? selectedPackage.cod_customer : ''}
        tip_customer={selectedPackage ? selectedPackage.tip_customer : ''}
      />
      {isBillingDetailsModalOpen && (
        <BillingDetailsModal
          isOpen={isBillingDetailsModalOpen}
          onClose={() => setIsBillingDetailsModalOpen(false)}
          onConfirm={handleBillingDetailsConfirm}
          packageType={selectedPackageType}
          packageDetails={selectedPackage ? selectedPackage[`${selectedPackageType}Packages`] : []}
          fetchData={fetchData}
          customerName={
            selectedPackage ? `${selectedPackage.firstName} ${selectedPackage.lastName}` : ''
          }
          cod_customer={selectedPackage ? selectedPackage.cod_customer : ''}
          tip_customer={selectedPackage ? selectedPackage.tip_customer : ''}
        />
      )}
    </div>
  )
}

PackageTable.propTypes = {
  filteredPackages: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
}

export default PackageTable
