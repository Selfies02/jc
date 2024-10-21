import React, { useContext } from 'react'
import { CAlert, CCard, CCardHeader, CCardBody } from '@coreui/react'
import { AuthContext } from '../../actions/authContext'
import ConfiguracionesTable from './components/ConfiguracionesTable'

const Configuraciones = () => {
  const { user } = useContext(AuthContext)

  if (user?.permissions?.find((perm) => perm.object === 'CONFIGURACIONES')?.canView === 0) {
    return <CAlert color="danger">No tienes permiso para ver esta pantalla</CAlert>
  }

  return (
    <CCard className="shadow-lg">
      <CCardHeader className="bg-primary text-white">
        <h3 className="text-center mb-0">Configuraciones</h3>
      </CCardHeader>
      <CCardBody>
        <ConfiguracionesTable />
      </CCardBody>
    </CCard>
  )
}

export default Configuraciones
