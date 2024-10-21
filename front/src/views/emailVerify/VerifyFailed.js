import React from 'react'
import { useLocation } from 'react-router-dom'
import { CContainer, CCard, CCardBody, CCardHeader, CButton, CRow, CCol } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilWarning } from '@coreui/icons'

const VerifyFailed = () => {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const error = params.get('error') || 'Ha ocurrido un error durante la verificación del correo.'

  return (
    <CContainer className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <CCard className="shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
        <CCardHeader className="text-center bg-danger text-white py-4">
          <CIcon icon={cilWarning} size="5xl" />
          <h2 className="mt-3">Verificación Fallida</h2>
        </CCardHeader>
        <CCardBody className="text-center">
          <p className="lead">{error}</p>
          <CButton href="/register" color="danger" size="lg" className="mt-4">
            Intentar de nuevo
          </CButton>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default VerifyFailed
