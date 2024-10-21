import React, { useEffect, useState, useContext } from 'react'
import { CustomersWithLockersService } from '../../services/customerService.js'
import { AuthContext } from '../../actions/authContext.js'
import { CSpinner, CAlert, CCard, CCardBody, CCardHeader } from '@coreui/react'
import CustomerTable from './components/CustomerTable.js'
import { toast } from 'react-hot-toast'

const ReportarPaquete = () => {
  const { user } = useContext(AuthContext)
  const [customers, setCustomers] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  if (user?.permissions?.find((perm) => perm.object === 'REPORTAR PAQUETE')?.canView === 0) {
    return <CAlert color="danger">No tienes permiso para ver esta pantalla</CAlert>
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await CustomersWithLockersService()

        if (data.success === false) {
          setError(data.message)
          setCustomers([])
          setFilteredCustomers([])
        } else if (Array.isArray(data.data) && data.data.length > 0) {
          setCustomers(data.data)
          setFilteredCustomers(data.data)
        } else {
          const message = 'No hay clientes con casilleros'
          setError(message)
          toast.info(message)
        }
      } catch (error) {
        const errorMessage = 'Error al obtener los datos'
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase()
    const filtered = customers.filter((customer) => {
      const fullName =
        `${customer.FIRSTNAME} ${customer.MIDDLENAME ? customer.MIDDLENAME : ''} ${customer.LASTNAME}`.toLowerCase()
      return (
        fullName.includes(lowerSearchTerm) ||
        customer.COD_VIRTUAL_LOCKERS?.toLowerCase().includes(lowerSearchTerm)
      )
    })
    setFilteredCustomers(filtered)
    setCurrentPage(1)
  }, [searchTerm, customers])

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
    <CCard className="shadow-lg">
      <CCardHeader className="bg-primary text-white">
        <h3 className="text-center mb-0">Buscar clientes</h3>
      </CCardHeader>
      <CCardBody>
        <CustomerTable
          filteredCustomers={filteredCustomers}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </CCardBody>
    </CCard>
  )
}

export default ReportarPaquete
