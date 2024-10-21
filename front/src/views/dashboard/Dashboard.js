import React, { useState, useEffect, useContext } from 'react'
import { CRow, CCol, CSpinner, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { getLockers } from '../../services/lockerSerivice.js'
import { AuthContext } from '../../actions/authContext.js'
import LockerCard from './components/LockerCard.js'
import PackageCharts from './components/PackagesCharts.js'

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const [lockers, setLockers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedLocker, setSelectedLocker] = useState(null)

  useEffect(() => {
    if (user.role === 'CLIENTE') {
      const fetchLockers = async () => {
        try {
          if (!user?.customerId) {
            throw new Error('No se encontró el ID de cliente.')
          }
          const data = await getLockers(user.customerId)
          const formattedData = data
            .map((locker) => ({
              ...locker,
              PRECIO: Number(locker.PRECIO),
            }))
            .sort((a, b) => a.PRECIO - b.PRECIO)
          setLockers(formattedData)
        } catch (error) {
          setError('Error al cargar los lockers')
        } finally {
          setLoading(false)
        }
      }
      fetchLockers()
    } else {
      setLoading(false)
    }
  }, [user.role, user.customerId])

  if (loading) {
    return (
      <CRow className="justify-content-center">
        <CCol xs="auto">
          <CSpinner color="primary" />
          <span className="ms-2">Cargando...</span>
        </CCol>
      </CRow>
    )
  }

  if (error) {
    return (
      <CRow className="justify-content-center">
        <CCol>{error}</CCol>
      </CRow>
    )
  }

  return (
    <CRow>
      <CCol>
        {user.role === 'CLIENTE' && (
          <CRow className="justify-content-center">
            {lockers.map((locker) => (
              <CCol key={locker.COD_LOCKER} sm={13} lg={9} xl={5}>
                <LockerCard
                  locker={locker}
                  selectedLocker={selectedLocker}
                  setSelectedLocker={setSelectedLocker}
                />
              </CCol>
            ))}
          </CRow>
        )}
        {user.role === 'ADMINISTRADOR' && (
          <CRow>
            <CCol xs={12}>
              <PackageCharts />
            </CCol>
          </CRow>
        )}
      </CCol>
    </CRow>
  )
}

export default Dashboard
