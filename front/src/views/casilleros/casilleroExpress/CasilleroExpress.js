import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { AuthContext } from '../../../actions/authContext.js'
import { getCustomerPackages } from '../../../services/customerService.js'
import {
  CSpinner,
  CAlert,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import MosaicView from './components/MosaicView.js'
import ListView from './components/ListView.js'
import ImageModal from './components/ImageModal.js'

const CasilleroNormal = () => {
  const { user } = useContext(AuthContext)
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('mosaic')
  const [modal, setModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await getCustomerPackages(user.customerId)

        if (data.message === 'No hay paquetes disponibles todavía.') {
          setPackages([])
        } else {
          setPackages(data.packages || [])
        }
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [user.customerId])

  // Verificar si tiene permiso para ver la pantalla
  if (user?.permissions?.find((perm) => perm.object === 'CASILLERO EXPRESS')?.canView === 0) {
    return <CAlert color="danger">No tienes permiso para ver esta pantalla</CAlert>
  }

  if (loading) {
    return <CSpinner color="primary" />
  }

  if (error) {
    return <CAlert color="warning">{error}</CAlert>
  }

  const handleImageClick = (image) => {
    setSelectedImage(image)
    setModal(true)
  }

  const filteredPackages = packages.filter((pkg) => pkg.COD_LOCKER === 1)

  return (
    <div>
      <h1 className="text-center">Paquetes en casillero express</h1>
      <div className="mb-3 d-flex justify-content-end align-items-center">
        <CDropdown className="ml-auto">
          <CDropdownToggle color="info">Modo Vista</CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem onClick={() => setViewMode('mosaic')}>Modo Mosaico</CDropdownItem>
            <CDropdownItem onClick={() => setViewMode('list')}>Modo Lista</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      </div>
      {viewMode === 'mosaic' ? (
        <MosaicView
          packages={filteredPackages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onImageClick={handleImageClick}
        />
      ) : (
        <ListView
          packages={filteredPackages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onImageClick={handleImageClick}
        />
      )}
      <ImageModal visible={modal} image={selectedImage} onClose={() => setModal(false)} />
    </div>
  )
}

CasilleroNormal.propTypes = {
  user: PropTypes.shape({
    customerId: PropTypes.string.isRequired,
    permissions: PropTypes.arrayOf(
      PropTypes.shape({
        object: PropTypes.string.isRequired,
        canView: PropTypes.number.isRequired,
      }),
    ),
  }),
}

export default CasilleroNormal
