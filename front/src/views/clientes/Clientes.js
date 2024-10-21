import React, { useContext, useState } from 'react'
import { CAlert, CCard, CCardHeader, CCardBody } from '@coreui/react'
import { AuthContext } from '../../actions/authContext'
import ClientesTable from './components/ClientesTable'

const Clientes = () => {
  const { user } = useContext(AuthContext)

  if (user?.permissions?.find((perm) => perm.object === 'CLIENTES')?.canView === 0) {
    return <CAlert color="danger">No tienes permiso para ver esta pantalla</CAlert>
  }

  return (
    <CCard className="shadow-lg">
      <CCardHeader className="bg-primary text-white">
        <h3 className="text-center mb-0">Clientes </h3>
      </CCardHeader>
      <CCardBody>
        <ClientesTable />
      </CCardBody>
    </CCard>
  )
}

export default Clientes
