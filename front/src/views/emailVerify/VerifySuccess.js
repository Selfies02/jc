import React from 'react'
import { useLocation } from 'react-router-dom'
import { CContainer, CCard, CCardBody, CCardHeader, CButton, CRow, CCol } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle } from '@coreui/icons'

const VerifySuccess = () => {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const message = params.get('message') || 'Correo verificado con éxito.'

  return (
    <CContainer className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <CCard className="shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
        <CCardHeader className="text-center bg-success text-white py-4">
          <CIcon icon={cilCheckCircle} size="5xl" />
          <h2 className="mt-3">¡Éxito!</h2>
        </CCardHeader>
        <CCardBody className="text-center">
          <p className="lead">{message}</p>
          <CButton href="/login" color="success" size="lg" className="mt-4">
            Ir a Iniciar Sesión
          </CButton>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default VerifySuccess
