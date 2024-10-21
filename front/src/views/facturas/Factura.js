import React, { useContext, useState } from 'react'
import { CAlert, CCard, CCardHeader, CCardBody } from '@coreui/react'
import { AuthContext } from '../../actions/authContext'
import FacturasTable from './components/FacturasTable'

const Facturas = () => {
  const { user } = useContext(AuthContext)
  const [currentCustomerName, setCurrentCustomerName] = useState('')

  // Verificar permisos
  if (user?.permissions?.find((perm) => perm.object === 'FACTURAS')?.canView === 0) {
    return <CAlert color="danger">No tienes permiso para ver esta pantalla</CAlert>
  }

  const handleCustomerSelect = (name) => {
    setCurrentCustomerName(name)
  }

  const handleCloseFacturas = () => {
    setCurrentCustomerName('')
  }

  return (
    <div style={{ marginBottom: '40px' }}>
      <CCard className="shadow-lg">
        <CCardHeader className="bg-primary text-white">
          <h3 className="text-center mb-0">
            {currentCustomerName ? `Facturas de ${currentCustomerName}` : 'Facturas'}
          </h3>
        </CCardHeader>
        <CCardBody>
          <FacturasTable
            onCustomerSelect={handleCustomerSelect}
            onCloseFacturas={handleCloseFacturas}
          />
        </CCardBody>
      </CCard>
    </div>
  )
}

export default Facturas
