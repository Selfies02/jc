import React from 'react'
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
} from '@coreui/react'
import { CBadge } from '@coreui/react'

const groupPackagesByCustomer = (packages) => {
  const grouped = {}

  packages.forEach((pkg) => {
    if (pkg.ESTADO === 'EN BODEGA') {
      const key = pkg.COD_CUSTOMER
      if (!grouped[key]) {
        grouped[key] = {
          firstName: pkg.FIRSTNAME,
          middleName: pkg.MIDDLENAME,
          lastName: pkg.LASTNAME,
          normalPackages: 0,
          expressPackages: 0,
          estado: 'EN BODEGA',
          codLocker: pkg.COD_LOCKER,
        }
      }

      if (pkg.COD_LOCKER === 2) {
        grouped[key].normalPackages += 1
      } else if (pkg.COD_LOCKER === 1) {
        grouped[key].expressPackages += 1
      }
    }
  })

  return Object.values(grouped)
}

const PackageTable = ({ filteredPackages, currentPage, itemsPerPage, setCurrentPage }) => {
  const groupedPackages = groupPackagesByCustomer(filteredPackages)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = groupedPackages.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(groupedPackages.length / itemsPerPage)

  const maxVisiblePages = 10
  const halfVisible = Math.floor(maxVisiblePages / 2)
  let startPage = Math.max(1, currentPage - halfVisible)
  let endPage = startPage + maxVisiblePages - 1

  if (endPage > totalPages) {
    endPage = totalPages
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  return (
    <div style={{ marginBottom: '40px' }}>
      <CTable align="middle" className="mb-0 border-light" hover responsive>
        <CTableHead color="dark">
          <CTableRow>
            <CTableHeaderCell className="text-white">Cliente</CTableHeaderCell>
            <CTableHeaderCell className="text-white text-center">Estado</CTableHeaderCell>
            <CTableHeaderCell className="text-white text-center">
              Paquetes normales
            </CTableHeaderCell>
            <CTableHeaderCell className="text-white text-center">Paquetes express</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentItems.length > 0 ? (
            currentItems.map((pkg, index) => (
              <CTableRow key={index}>
                <CTableDataCell>
                  {`${pkg.firstName} ${pkg.middleName || ''} ${pkg.lastName}`.trim()}
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  <CBadge color="primary">{pkg.estado}</CBadge>
                </CTableDataCell>
                <CTableDataCell className="text-center">{pkg.normalPackages}</CTableDataCell>
                <CTableDataCell className="text-center">{pkg.expressPackages}</CTableDataCell>
              </CTableRow>
            ))
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
              style={{ cursor: 'pointer' }}
            >
              <span aria-hidden="true">&laquo;</span>
            </CPaginationItem>
            {[...Array(endPage - startPage + 1)].map((_, i) => {
              const pageNumber = startPage + i
              return (
                <CPaginationItem
                  key={pageNumber}
                  active={currentPage === pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  style={{ cursor: 'pointer' }}
                >
                  {pageNumber}
                </CPaginationItem>
              )
            })}
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
    </div>
  )
}

PackageTable.propTypes = {
  filteredPackages: PropTypes.arrayOf(
    PropTypes.shape({
      FIRSTNAME: PropTypes.string.isRequired,
      MIDDLENAME: PropTypes.string,
      LASTNAME: PropTypes.string.isRequired,
      TRACKING: PropTypes.string.isRequired,
      ESTADO: PropTypes.string,
      COD_LOCKER: PropTypes.number.isRequired,
      EMAIL: PropTypes.string,
      IMAGEN: PropTypes.string,
      COD_CUSTOMER: PropTypes.number,
    }),
  ).isRequired,
  currentPage: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
}

export default PackageTable
