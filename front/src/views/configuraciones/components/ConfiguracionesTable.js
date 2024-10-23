import React, { useState, useEffect, useMemo, useContext } from 'react'
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
import { cilPencil } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { getAllPrecios } from '../../../services/precioService'
import { AuthContext } from '../../../actions/authContext'
import UpdModalConfiguraciones from './UpdModalConfiguraciones'
import { toast } from 'react-hot-toast'

const ConfiguracionesTable = () => {
  const [precios, setPrecios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 10
  const [selectedPrecio, setSelectedPrecio] = useState(null)
  const { user } = useContext(AuthContext)

  const fetchPrecios = async () => {
    setLoading(true)
    try {
      const data = await getAllPrecios()
      setPrecios(data)
    } catch (error) {
      setError('Error al cargar los precios. Por favor, intente de nuevo.')
      toast.error(error.message || 'Error al cargar los precios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrecios()
  }, [])

  const filteredPrecios = useMemo(() => {
    return precios.filter((precio) =>
      precio.DES_PRECIO.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [precios, searchTerm])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentPrecios = filteredPrecios.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredPrecios.length / itemsPerPage)

  const handleEditClick = (precio) => {
    setSelectedPrecio(precio)
  }

  const handleCloseModal = () => {
    setSelectedPrecio(null)
  }

  const handleUpdatePrecio = () => {
    fetchPrecios()
  }

  if (loading) {
    return <CSpinner color="primary" />
  }

  if (error) {
    return <div className="text-center text-danger">{error}</div>
  }

  const visiblePages = []
  const maxVisiblePages = 10
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages)

  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i)
  }

  return (
    <div style={{ marginBottom: '40px' }}>
      <div className="d-flex justify-content-between mb-3">
        <CFormInput
          type="text"
          placeholder="Buscar por descripción"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <CTable align="middle" className="mb-0 border-light" hover responsive>
        <CTableHead color="dark">
          <CTableRow>
            <CTableHeaderCell className="text-white">Descripción</CTableHeaderCell>
            <CTableHeaderCell className="text-white text-right">Precio</CTableHeaderCell>
            <CTableHeaderCell className="text-white text-center">Acciones</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentPrecios.length > 0 ? (
            currentPrecios.map((precio) => (
              <CTableRow key={precio.COD_PRECIO}>
                <CTableDataCell>{precio.DES_PRECIO}</CTableDataCell>
                <CTableDataCell className="text-right">
                  ${parseFloat(precio.PRECIO).toFixed(2)}
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  <CButton color="primary" onClick={() => handleEditClick(precio)}>
                    <CIcon icon={cilPencil} className="me-2" />
                    <span className="d-none d-sm-inline">Editar</span>
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="3" className="text-center">
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
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
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
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              style={{ cursor: 'pointer' }}
            >
              <span aria-hidden="true">&raquo;</span>
            </CPaginationItem>
          </CPagination>
        </div>
      )}
      <UpdModalConfiguraciones
        precio={selectedPrecio}
        onClose={handleCloseModal}
        onUpdate={handleUpdatePrecio}
      />
    </div>
  )
}

export default ConfiguracionesTable
