import React, { useEffect, useState, useContext } from 'react'
import { getCustomerPackageStatusListoParaRetirar } from '../../services/packageService'
import { AuthContext } from '../../actions/authContext'
import { CSpinner, CAlert, CCard, CCardBody, CCardHeader } from '@coreui/react'
import PackageTable from './components/PackageTable'
import { toast } from 'react-hot-toast'

const Facturar = () => {
  const { user } = useContext(AuthContext)
  const [packages, setPackages] = useState([])
  const [filteredPackages, setFilteredPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Verificar permisos de usuario
  if (user?.permissions?.find((perm) => perm.object === 'FACTURAR')?.canView === 0) {
    return <CAlert color="danger">No tienes permiso para ver esta pantalla</CAlert>
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const data = await getCustomerPackageStatusListoParaRetirar()
      if (data?.data?.length > 0) {
        setPackages(data.data)
        setFilteredPackages(data.data)
      } else {
        setError('No hay paquetes para facturar todavía.')
      }
    } catch (error) {
      toast.error(error.message || 'Error al obtener los datos')
      setError('Error al obtener los datos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase()
    const filtered = packages.filter((pkg) => {
      const fullName =
        `${pkg.FIRSTNAME} ${pkg.MIDDLENAME ? pkg.MIDDLENAME : ''} ${pkg.LASTNAME}`.toLowerCase()
      return (
        fullName.includes(lowerSearchTerm) || pkg.TRACKING?.toLowerCase().includes(lowerSearchTerm)
      )
    })
    setFilteredPackages(filtered)
    setCurrentPage(1)
  }, [searchTerm, packages])

  if (loading) {
    return (
      <div className="text-center mt-5">
        <CSpinner color="primary" />
        <p>Cargando...</p>
      </div>
    )
  }

  if (error) {
    return <CAlert color="warning">{error}</CAlert>
  }

  return (
    <>
      <CCard className="shadow-lg">
        <CCardHeader className="bg-primary text-white">
          <h3 className="text-center mb-0">Facturar paquetes</h3>
        </CCardHeader>
        <CCardBody>
          <PackageTable
            filteredPackages={filteredPackages}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            setCurrentPage={setCurrentPage}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            fetchData={fetchData}
          />
        </CCardBody>
      </CCard>
    </>
  )
}

export default Facturar
