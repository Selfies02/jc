import React, { useEffect, useState, useContext } from 'react'
import {
  getCustomerPackageStatusEnTransito,
  updatePackageStatusLlegada,
} from '../../services/packageService'
import { AuthContext } from '../../actions/authContext'
import { CSpinner, CAlert, CCard, CCardBody, CCardHeader, CButton } from '@coreui/react'
import { toast } from 'react-hot-toast'
import PackageTable from './components/PackageTable'
import ConfirmModal from './components/ConfirmModal'

const ReportarLlegada = () => {
  const { user } = useContext(AuthContext)
  const [packages, setPackages] = useState([])
  const [filteredPackages, setFilteredPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isReporting, setIsReporting] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedReportType, setSelectedReportType] = useState(null)
  const [selectedCodLocker, setSelectedCodLocker] = useState(null)

  // Verificar permisos de usuario
  if (user?.permissions?.find((perm) => perm.object === 'REPORTAR LLEGADA')?.canView === 0) {
    return <CAlert color="danger">No tienes permiso para ver esta pantalla</CAlert>
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const data = await getCustomerPackageStatusEnTransito()
      if (data?.data?.length > 0) {
        setPackages(data.data)
        setFilteredPackages(data.data)
      } else {
        setError('No hay paquetes con estado EN TRANSITO todavía')
      }
    } catch (error) {
      setError('Error al obtener los datos')
      toast.error(error.message)
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

  const handleReport = async () => {
    setIsReporting(true)
    const updatePromise = async () => {
      const formData = { cod_locker: selectedCodLocker }
      const response = await updatePackageStatusLlegada(formData)

      if (response.success) {
        return response.message
      } else {
        throw new Error(response.message)
      }
    }

    toast
      .promise(updatePromise(), {
        loading: 'Enviando notificación a los clientes...',
        success: (message) => message,
        error: (err) => err.message || 'Error al reportar llegada. Inténtalo de nuevo.',
      })
      .then(() => {
        fetchData()
      })
      .catch((err) => {
        toast.error('Error al reportar llegada')
      })
      .finally(() => {
        setIsReporting(false)
        setShowConfirmModal(false)
      })
  }
  const showConfirm = (codLocker, tipoReporte) => {
    setSelectedCodLocker(codLocker)
    setSelectedReportType(tipoReporte)
    setShowConfirmModal(true)
  }

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

  // Comprobar la cantidad de paquetes
  const hasNormalPackages = filteredPackages.some((pkg) => pkg.COD_LOCKER === 2)
  const hasExpressPackages = filteredPackages.some((pkg) => pkg.COD_LOCKER === 1)

  return (
    <div style={{ marginBottom: '40px' }}>
      <CCard className="shadow-lg">
        <CCardHeader className="bg-primary text-white">
          <h3 className="text-center mb-0">Estado de los paquetes</h3>
        </CCardHeader>
        <CCardBody>
          <div className="d-flex justify-content-between mb-4">
            <CButton
              color="success"
              onClick={() => showConfirm(2, 'envío normal')}
              disabled={isReporting || !hasNormalPackages}
            >
              {isReporting ? 'Reportando...' : 'Reportar llegada normal'}
            </CButton>
            <CButton
              color="warning"
              onClick={() => showConfirm(1, 'envío express')}
              disabled={isReporting || !hasExpressPackages}
            >
              {isReporting ? 'Reportando...' : 'Reportar llegada express'}
            </CButton>
          </div>

          <PackageTable
            filteredPackages={filteredPackages}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            setCurrentPage={setCurrentPage}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </CCardBody>
      </CCard>

      <ConfirmModal
        visible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleReport}
        reportType={selectedReportType}
        isReporting={isReporting}
      />
    </div>
  )
}

export default ReportarLlegada
