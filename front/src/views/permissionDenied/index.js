import React from 'react'
import { CContainer, CRow, CCol, CAlert } from '@coreui/react'

const PermissionDenied = () => {
  return (
    <CContainer>
      <CRow className="justify-content-center">
        <CCol md={6}>
          <CAlert color="danger" className="text-center mt-5">
            <h4 className="alert-heading">Acceso Denegado</h4>
            <p>No tienes permisos para acceder a esta pantalla.</p>
          </CAlert>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default PermissionDenied
