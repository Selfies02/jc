import React from 'react'
import PropTypes from 'prop-types'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CPagination,
  CPaginationItem,
  CAlert,
} from '@coreui/react'
import config from '../../../../config'

const ListView = ({ packages, currentPage, setCurrentPage, onImageClick }) => {
  const itemsPerPage = 12
  const indexOfLastPackage = currentPage * itemsPerPage
  const indexOfFirstPackage = indexOfLastPackage - itemsPerPage
  const fullBackendUrl = config.getFullBackendUrl()

  // Sorting packages by status
  const sortedPackages = [...packages].sort((a, b) => {
    const statusOrder = {
      'EN BODEGA': 1,
      'EN TRANSITO': 2,
      'LISTO PARA RETIRAR': 3,
      ENTREGADO: 4,
    }
    return statusOrder[a.ESTADO] - statusOrder[b.ESTADO]
  })

  const currentPackages = sortedPackages.slice(indexOfFirstPackage, indexOfLastPackage)
  const totalPages = Math.ceil(sortedPackages.length / itemsPerPage)

  const pageRange = 10
  let startPage = Math.max(currentPage - Math.floor(pageRange / 2), 1)
  let endPage = startPage + pageRange - 1

  if (endPage > totalPages) {
    endPage = totalPages
    startPage = Math.max(endPage - pageRange + 1, 1)
  }

  const pageNumbers = [...Array(endPage - startPage + 1)].map((_, i) => startPage + i)

  return (
    <div style={{ marginBottom: '40px' }}>
      {currentPackages.length > 0 ? (
        <CCard className="shadow-lg">
          <CCardHeader className="bg-primary text-white">
            <h3 className="text-center mb-0">Estado de los paquetes</h3>
          </CCardHeader>
          <CCardBody>
            <div className="table-responsive">
              <CTable className="text-center" style={{ verticalAlign: 'middle' }}>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Número de tracking</CTableHeaderCell>
                    <CTableHeaderCell>Imagen</CTableHeaderCell>
                    <CTableHeaderCell>Estado</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {currentPackages.map((pkg) => (
                    <CTableRow key={pkg.TRACKING}>
                      <CTableDataCell>{pkg.TRACKING}</CTableDataCell>
                      <CTableDataCell>
                        <img
                          src={`${fullBackendUrl}/${pkg.IMAGEN}`}
                          alt="Package"
                          style={{
                            cursor: 'pointer',
                            maxWidth: '50px',
                            maxHeight: '50px',
                            width: 'auto',
                            height: 'auto',
                          }}
                          onClick={() => onImageClick(`${fullBackendUrl}/${pkg.IMAGEN}`)}
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={getBadgeColor(pkg.ESTADO)}>
                          {pkg.ESTADO === 'EN BODEGA' ? `${pkg.ESTADO} DE MIAMI` : pkg.ESTADO}
                        </CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
            <CPagination className="justify-content-center mt-3">
              <CPaginationItem
                aria-label="Previous"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                style={{ cursor: 'pointer' }}
              >
                <span aria-hidden="true">&laquo;</span>
              </CPaginationItem>
              {pageNumbers.map((number) => (
                <CPaginationItem
                  key={number}
                  active={currentPage === number}
                  onClick={() => setCurrentPage(number)}
                  style={{ cursor: 'pointer' }}
                >
                  {number}
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
          </CCardBody>
        </CCard>
      ) : (
        <CAlert color="warning">No hay paquetes disponibles</CAlert>
      )}
    </div>
  )
}

const getBadgeColor = (status) => {
  switch (status) {
    case 'EN BODEGA':
      return 'primary'
    case 'EN TRANSITO':
      return 'warning'
    case 'LISTO PARA RETIRAR':
      return 'info'
    case 'ENTREGADO':
      return 'success'
    default:
      return 'secondary'
  }
}

ListView.propTypes = {
  packages: PropTypes.arrayOf(
    PropTypes.shape({
      TRACKING: PropTypes.string.isRequired,
      IMAGEN: PropTypes.string.isRequired,
      ESTADO: PropTypes.string.isRequired,
      COD_LOCKER: PropTypes.number.isRequired,
    }),
  ).isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  onImageClick: PropTypes.func.isRequired,
}

export default ListView
