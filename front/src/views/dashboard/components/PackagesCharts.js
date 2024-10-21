import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardTitle,
  CCol,
  CRow,
  CSpinner,
  CProgress,
  CProgressBar,
  CButtonGroup,
  CButton,
} from '@coreui/react'
import { getPackageCounts } from '../../../services/packageService.js'
import { getInvoiceTotals } from '../../../services/invoiceService.js'
import CIcon from '@coreui/icons-react'
import {
  cilStorage,
  cilTruck,
  cilCheckCircle,
  cilThumbUp,
  cilChart,
  cilBasket,
  cilBriefcase,
  cilEnvelopeClosed,
} from '@coreui/icons'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { toast } from 'react-hot-toast'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const StatCard = ({
  title,
  value,
  color = 'secondary',
  icon,
  secondaryIcon,
  percentage = 0,
  onClick,
  clickable = true,
}) => (
  <CCard
    className={`mb-4 text-white bg-${color} shadow-lg h-100`}
    onClick={clickable ? onClick : null}
    style={{ cursor: clickable ? 'pointer' : 'default' }}
  >
    <CCardBody className="d-flex flex-column justify-content-between">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <CCardTitle className="text-uppercase fs-6 mb-2">{title}</CCardTitle>
          <div className="fs-2 fw-bold">{value}</div>
        </div>
        <div className="p-2 rounded-circle bg-white bg-opacity-25">
          <CIcon icon={icon} size="xl" className="text-white" />
        </div>
      </div>
      <CProgress className="mb-3" height={8}>
        <CProgressBar color="secondary" value={percentage} />
      </CProgress>
      <div className="d-flex justify-content-between align-items-center">
        <div className="fs-6">{percentage.toFixed(1)}% del total</div>
        <CIcon icon={secondaryIcon} size="lg" className="text-white opacity-75" />
      </div>
    </CCardBody>
  </CCard>
)

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  secondaryIcon: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  percentage: PropTypes.number,
  onClick: PropTypes.func,
  clickable: PropTypes.bool,
}

const PackageCharts = () => {
  const [packageCounts, setPackageCounts] = useState([])
  const [invoiceTotals, setInvoiceTotals] = useState([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('day')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const [packageData, invoiceData] = await Promise.all([
          getPackageCounts(),
          getInvoiceTotals(period),
        ])

        setPackageCounts(packageData.ok ? packageData.packageCounts : [])

        if (invoiceData.ok) {
          setInvoiceTotals(invoiceData.invoiceTotals)
        } else {
          setInvoiceTotals([])
        }
      } catch (error) {
        toast.error('Ocurrió un error al obtener los datos')
        setPackageCounts([])
        setInvoiceTotals([])
        setError('Ocurrió un error al obtener los datos')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [period])

  const formatDate = (dateString, period) => {
    if (period === 'year') {
      return dateString
    }

    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      toast.error('Fecha no valida')
      return 'Fecha no valida'
    }

    if (period === 'day') {
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
    } else if (period === 'month') {
      return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
    }
  }

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

  const colorMap = {
    'EN BODEGA': 'primary',
    'EN TRANSITO': 'warning',
    'LISTO PARA RETIRAR': 'info',
    ENTREGADO: 'success',
  }

  const iconMap = {
    'EN BODEGA': cilStorage,
    'EN TRANSITO': cilTruck,
    'LISTO PARA RETIRAR': cilCheckCircle,
    ENTREGADO: cilThumbUp,
  }

  const secondaryIconMap = {
    'EN BODEGA': cilBasket,
    'EN TRANSITO': cilBriefcase,
    'LISTO PARA RETIRAR': cilEnvelopeClosed,
    ENTREGADO: cilChart,
  }

  const navigationMap = {
    'EN BODEGA': () => navigate('/reportar_salida'),
    'EN TRANSITO': () => navigate('/reportar_llegada'),
    'LISTO PARA RETIRAR': () => navigate('/facturar'),
    ENTREGADO: () => navigate('/facturas'),
  }

  const sortedPackageCounts = packageCounts.length
    ? packageCounts.sort((a, b) => {
        const order = ['EN BODEGA', 'EN TRANSITO', 'LISTO PARA RETIRAR', 'ENTREGADO']
        return order.indexOf(a.ESTADO) - order.indexOf(b.ESTADO)
      })
    : [
        { ESTADO: 'EN BODEGA', Total: 0 },
        { ESTADO: 'EN TRANSITO', Total: 0 },
        { ESTADO: 'LISTO PARA RETIRAR', Total: 0 },
        { ESTADO: 'ENTREGADO', Total: 0 },
      ]

  const totalPackages = sortedPackageCounts.reduce((sum, item) => sum + item.Total, 0)

  const handlePeriodChange = (selectedPeriod) => {
    setPeriod(selectedPeriod)
  }

  const chartData = {
    labels: invoiceTotals.map((item) => formatDate(item.period, period)),
    datasets: [
      {
        label: 'Dinero',
        data: invoiceTotals.map((item) => item.total),
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Dinero',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value, index, values) {
            return 'L' + value.toLocaleString()
          },
        },
      },
      x: {
        ticks: {
          maxRotation: 0,
          minRotation: 0,
        },
      },
    },
  }

  return (
    <div style={{ marginBottom: '40px' }}>
      <CRow>
        {sortedPackageCounts.map((item, index) => (
          <CCol sm={6} lg={3} key={index} className="mb-4">
            <StatCard
              title={item.ESTADO}
              value={item.Total}
              color={colorMap[item.ESTADO] || 'secondary'}
              icon={iconMap[item.ESTADO] || cilStorage}
              secondaryIcon={secondaryIconMap[item.ESTADO] || cilBasket}
              percentage={(item.Total / totalPackages) * 100}
              onClick={navigationMap[item.ESTADO]}
            />
          </CCol>
        ))}
      </CRow>
      <CRow className="mt-4">
        <CCol xs={12}>
          <CCard>
            <CCardBody>
              <CButtonGroup className="mb-3">
                <CButton
                  color={period === 'day' ? 'primary' : 'secondary'}
                  onClick={() => handlePeriodChange('day')}
                >
                  Día
                </CButton>
                <CButton
                  color={period === 'month' ? 'primary' : 'secondary'}
                  onClick={() => handlePeriodChange('month')}
                >
                  Mes
                </CButton>
                <CButton
                  color={period === 'year' ? 'primary' : 'secondary'}
                  onClick={() => handlePeriodChange('year')}
                >
                  Año
                </CButton>
              </CButtonGroup>
              <div style={{ height: '400px' }}>
                <Line data={chartData} options={chartOptions} />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default PackageCharts
