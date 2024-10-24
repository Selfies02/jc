import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardImage,
  CRow,
  CCol,
  CBadge,
  CPagination,
  CPaginationItem,
  CAlert,
} from '@coreui/react'
import config from '../../../../config'

const MosaicView = ({ packages, currentPage, setCurrentPage, onImageClick }) => {
  const itemsPerPage = 12
  const indexOfLastPackage = currentPage * itemsPerPage
  const indexOfFirstPackage = indexOfLastPackage - itemsPerPage
  const fullBackendUrl = config.getFullBackendUrl()

  const [placeholderImages, setPlaceholderImages] = useState({})

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

  const handleImageError = (e, tracking) => {
    e.target.src = 'https://placehold.co/600x400/?text=Sin+imagen'
    e.target.style.display = 'block'
    e.target.style.objectFit = 'cover'
    setPlaceholderImages((prev) => ({
      ...prev,
      [tracking]: true,
    }))
  }

  const handleImageClick = (tracking, imagePath) => {
    if (!placeholderImages[tracking]) {
      onImageClick(imagePath)
    }
  }

  return (
    <>
      {currentPackages.length > 0 ? (
        <>
          <CRow>
            {currentPackages.map((pkg) => (
              <CCol sm="8" md="3" lg="3" key={pkg.TRACKING} className="mb-4">
                <CCard>
                  <CCardHeader className="bg-primary text-white text-center">
                    <strong>Tracking</strong>
                    <br />
                    <strong>{pkg.TRACKING}</strong>
                  </CCardHeader>
                  <div
                    className="position-relative"
                    style={{
                      height: '200px',
                      overflow: 'hidden',
                      backgroundColor: '#2a2b36',
                    }}
                  >
                    <CCardImage
                      src={`${fullBackendUrl}/${pkg.IMAGEN}`}
                      alt="Package"
                      onError={(e) => handleImageError(e, pkg.TRACKING)}
                      onClick={() =>
                        handleImageClick(pkg.TRACKING, `${fullBackendUrl}/${pkg.IMAGEN}`)
                      }
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        cursor: placeholderImages[pkg.TRACKING] ? 'default' : 'pointer',
                      }}
                    />
                  </div>
                  <CCardBody className="text-center">
                    <CBadge color={getBadgeColor(pkg.ESTADO)}>
                      {pkg.ESTADO === 'EN BODEGA' ? `${pkg.ESTADO} DE MIAMI` : pkg.ESTADO}
                    </CBadge>
                  </CCardBody>
                </CCard>
              </CCol>
            ))}
          </CRow>
          <CPagination className="justify-content-end mt-3">
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
        </>
      ) : (
        <CAlert color="warning">No hay paquetes disponibles</CAlert>
      )}
    </>
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

MosaicView.propTypes = {
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

export default MosaicView
