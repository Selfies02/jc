import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CButton,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
} from '@coreui/react'
import { toast } from 'react-hot-toast'
import { AuthContext } from '../../../actions/authContext.js'
import { insertInvoiceAndCharges } from '../../../services/invoiceService.js'
import { getCustomerAddressAndPhone } from '../../../services/customerService.js'
import PDFGenerator from './InvoicePDFGenerator'
import { getJetCargo } from '../../../services/jerCargoService.js'
import { getAllPrecios } from '../../../services/precioService.js'

const BillingDetailsModal = ({
  isOpen,
  onClose,
  packageType,
  packageDetails,
  fetchData,
  customerName,
  cod_customer,
  tip_customer,
}) => {
  const { user } = useContext(AuthContext)
  const [packages, setPackages] = useState([])
  const [dollarExchangeRate, setDollarExchangeRate] = useState('')
  const [pricePerPound, setPricePerPound] = useState('')
  const [grandTotal, setGrandTotal] = useState('L 0.00')
  const [delivery, setDelivery] = useState()
  const [paymentMethod, setPaymentMethod] = useState('')
  const [hasRTN, setHasRTN] = useState(false)
  const [rtnNumber, setRtnNumber] = useState('')
  const [subtotal, setSubtotal] = useState('L 0.00')
  const [totalISV, setTotalISV] = useState('L 0.00')
  const [jetCargoData, setJetCargoData] = useState(null)
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [isInvoicing, setIsInvoicing] = useState(false)

  const ISV_RATE = 0.15

  useEffect(() => {
    const fetchJetCargoData = async () => {
      try {
        const data = await getJetCargo()
        setJetCargoData(data)
      } catch (error) {
        toast.error(error.message || 'Error al obtener datos de JetCargo')
      }
    }

    const fetchCustomerData = async () => {
      try {
        const { phone, address } = await getCustomerAddressAndPhone(cod_customer)
        setCustomerPhone(phone)
        setCustomerAddress(address)
      } catch (error) {
        toast.error(error.message || 'Error al obtener datos del cliente')
      }
    }

    const fetchPricePerPound = async () => {
      try {
        const precios = await getAllPrecios()
        let selectedPrice

        if (packageType === 'express') {
          selectedPrice = precios.find((precio) => precio.COD_PRECIO === 3)
        } else {
          if (tip_customer === 'N') {
            selectedPrice = precios.find((precio) => precio.COD_PRECIO === 1)
          } else if (tip_customer === 'E') {
            selectedPrice = precios.find((precio) => precio.COD_PRECIO === 2)
          }
        }

        if (selectedPrice) {
          setPricePerPound(`$ ${selectedPrice.PRECIO}`)
        } else {
          toast.error('No se pudo encontrar un precio adecuado')
        }
      } catch (error) {
        toast.error(error.message || 'Error al obtener el precio por libra')
      }
    }

    const fetchExchangeRate = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
        const data = await response.json()
        const rate = data.rates.HNL
        setDollarExchangeRate(`L ${rate.toFixed(2)}`)
      } catch (error) {
        toast.error('Error al obtener el tipo de cambio')
      }
    }

    fetchJetCargoData()
    fetchCustomerData()
    fetchPricePerPound()
    fetchExchangeRate()
  }, [cod_customer])

  useEffect(() => {
    if (packageDetails.length > 0) {
      const initialPackages = packageDetails.map((pkg) => ({
        ...pkg,
        volumetricWeight: '',
        realWeight: '',
        isv: '',
        subtotal: '',
        total: '',
      }))
      setPackages(initialPackages)
    }
  }, [packageDetails])

  const formatNumber = (num) => {
    let value = parseFloat(num)
    return value.toLocaleString('en-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const updatePackageDetails = (index, field, value) => {
    const updatedPackages = [...packages]
    updatedPackages[index] = { ...updatedPackages[index], [field]: value }

    if (field === 'volumetricWeight' || field === 'realWeight') {
      updatePackageFinancials(updatedPackages, index)
    }

    setPackages(updatedPackages)
    updateGrandTotal(updatedPackages)
  }

  const updatePackageFinancials = (updatedPackages, index) => {
    const pkg = updatedPackages[index]
    if (pkg.volumetricWeight && pkg.realWeight && pricePerPound && dollarExchangeRate) {
      const weight = Math.max(Number(pkg.volumetricWeight), Number(pkg.realWeight))
      const priceInLempiras =
        Number(pricePerPound.replace('$ ', '')) * Number(dollarExchangeRate.replace('L ', ''))
      const calculatedTotal = weight * priceInLempiras

      const calculatedISV = calculatedTotal * ISV_RATE
      const calculatedSubtotal = calculatedTotal - calculatedISV

      const roundedSubtotal = calculatedSubtotal
      const roundedISV = calculatedISV
      const roundedTotal = roundedSubtotal + roundedISV

      updatedPackages[index].subtotal = formatNumber(roundedSubtotal)
      updatedPackages[index].isv = formatNumber(roundedISV)
      updatedPackages[index].total = formatNumber(roundedTotal)
    }
  }

  const updateAllPackages = () => {
    const updatedPackages = packages.map((pkg) => {
      const updatedPkg = { ...pkg }
      updatePackageFinancials([updatedPkg], 0)
      return updatedPkg
    })
    setPackages(updatedPackages)
    updateGrandTotal(updatedPackages)
  }

  const updateGrandTotal = (updatedPackages) => {
    const total = updatedPackages.reduce((sum, pkg) => {
      return sum + (pkg.total ? parseFloat(pkg.total.replace(/,/g, '')) : 0)
    }, 0)

    const subtotalValue = updatedPackages.reduce((sum, pkg) => {
      return sum + (pkg.subtotal ? parseFloat(pkg.subtotal.replace(/,/g, '')) : 0)
    }, 0)

    const totalISVValue = updatedPackages.reduce((sum, pkg) => {
      return sum + (pkg.isv ? parseFloat(pkg.isv.replace(/,/g, '')) : 0)
    }, 0)

    setSubtotal(`L${formatNumber(subtotalValue)}`)
    setTotalISV(`L${formatNumber(totalISVValue)}`)
    setGrandTotal(`L${formatNumber(total)}`)
  }

  useEffect(() => {
    if (dollarExchangeRate && pricePerPound) {
      updateAllPackages()
    }
  }, [dollarExchangeRate, pricePerPound])

  const handleClose = () => {
    setPackages([])
    setDollarExchangeRate('')
    setPricePerPound('')
    setGrandTotal('L0.00')
    setDelivery(undefined)
    setPaymentMethod('')
    onClose()
  }

  const handleConfirm = async () => {
    if (!isFormValid()) {
      toast.error(
        'Por favor, complete todos los campos requeridos antes de confirmar la facturación.',
      )
      return
    }

    setIsInvoicing(true)

    const charges = packages.map((pkg) => ({
      COD_PAQUETETRANSITO: pkg.codPaqueteTransito,
      PESO_VOLUMEN: pkg.volumetricWeight,
      PESO_REAL: pkg.realWeight,
      ISV: parseFloat(pkg.isv.replace(/,/g, '')),
      SUBTOTAL: parseFloat(pkg.subtotal.replace(/,/g, '')),
      TOTAL: parseFloat(pkg.total.replace(/,/g, '')),
      DELIVERY: delivery,
      PAYMENTMETHOD: paymentMethod,
    }))

    const usr_add = user?.firstName

    try {
      const pdfBlob = await PDFGenerator(
        charges,
        customerName,
        rtnNumber,
        subtotal,
        totalISV,
        grandTotal,
        packages,
        pricePerPound,
        dollarExchangeRate,
        jetCargoData,
        customerPhone,
        customerAddress,
      )

      const response = await insertInvoiceAndCharges({ usr_add, charges }, pdfBlob)
      toast.success(response.message)

      fetchData()
      handleClose()

      const pdfUrl = window.URL.createObjectURL(pdfBlob)
      window.open(pdfUrl, '_blank')
    } catch (error) {
      toast.error(`Error al generar el PDF`)
    }
  }

  const handleRTNChange = (e) => {
    setHasRTN(e.target.value === '1')
    if (e.target.value === '0') {
      setRtnNumber('')
    }
  }

  const isFormValid = () => {
    return (
      packages.every((pkg) => pkg.volumetricWeight && pkg.realWeight) &&
      dollarExchangeRate &&
      pricePerPound &&
      paymentMethod &&
      delivery !== undefined &&
      (!hasRTN || (hasRTN && rtnNumber.trim() !== ''))
    )
  }

  const handlePricePerPoundChange = (e) => {
    let value = e.target.value.replace('$ ', '')

    const regex = /^(?!0\d)\d{0,8}(\.\d{0,2})?$/

    if (regex.test(value) || value === '') {
      setPricePerPound(value ? `$ ${value}` : '')
    }
  }

  const handleDollarExchangeRateChange = (e) => {
    let value = e.target.value.replace('L ', '')

    const regex = /^(?!0\d)\d{0,8}(\.\d{0,2})?$/

    if (regex.test(value) || value === '') {
      setDollarExchangeRate(value ? `L ${value}` : '')
    }
  }

  return (
    <CModal
      className="modal-dialog-scrollable"
      visible={isOpen}
      onClose={handleClose}
      backdrop="static"
      size="xl"
    >
      <CModalHeader>
        <CModalTitle>
          Detalles de facturación {packageType === 'normal' ? 'Normal' : 'Express'} para{' '}
          {customerName}
        </CModalTitle>
      </CModalHeader>

      <CModalBody>
        <CCard className="mb-3">
          <CCardHeader>Información general</CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md="6">
                <CFormInput
                  type="text"
                  label="Cambio del dólar"
                  value={dollarExchangeRate}
                  onChange={handleDollarExchangeRateChange}
                  placeholder="L 0.00"
                  disabled
                />
              </CCol>
              <CCol md="6">
                <CFormInput
                  type="text"
                  label="Precio por libra"
                  value={pricePerPound}
                  onChange={handlePricePerPoundChange}
                  placeholder="$ 0.00"
                  disabled
                />
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol md="6">
                <div>
                  <label>RTN:</label>
                  <div>
                    <label className="form-check-label me-3">
                      <input
                        className="form-check-input me-1"
                        type="radio"
                        value="1"
                        checked={hasRTN}
                        onChange={handleRTNChange}
                      />
                      Sí
                    </label>
                    <label className="form-check-label">
                      <input
                        className="form-check-input me-1"
                        type="radio"
                        value="0"
                        checked={!hasRTN}
                        onChange={handleRTNChange}
                      />
                      No
                    </label>
                  </div>
                </div>
              </CCol>
              <CCol md="6">
                {hasRTN && (
                  <CFormInput
                    type="text"
                    label="Número de RTN"
                    value={rtnNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 15)
                      setRtnNumber(value)
                    }}
                    placeholder="Ingrese el número de RTN"
                  />
                )}
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>

        <CRow className="mb-3">
          <CCol md="6" className="mb-3 mb-md-0">
            <CCard>
              <CCardHeader>Opciones de entrega</CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol>
                    <label className="form-check-label">
                      <input
                        className="form-check-input"
                        type="radio"
                        value={1}
                        checked={delivery === 1}
                        onChange={() => setDelivery(1)}
                      />{' '}
                      Sí
                    </label>
                    <br />
                    <label className="form-check-label">
                      <input
                        className="form-check-input"
                        type="radio"
                        value={0}
                        checked={delivery === 0}
                        onChange={() => setDelivery(0)}
                      />{' '}
                      No
                    </label>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol md="6">
            <CCard>
              <CCardHeader>Método de pago</CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol>
                    <label className="form-check-label">
                      <input
                        className="form-check-input"
                        type="radio"
                        value="EFECTIVO"
                        checked={paymentMethod === 'EFECTIVO'}
                        onChange={() => setPaymentMethod('EFECTIVO')}
                      />{' '}
                      Efectivo
                    </label>
                    <br />
                    <label className="form-check-label">
                      <input
                        className="form-check-input"
                        type="radio"
                        value="TRANSFERENCIA"
                        checked={paymentMethod === 'TRANSFERENCIA'}
                        onChange={() => setPaymentMethod('TRANSFERENCIA')}
                      />{' '}
                      Transferencia
                    </label>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <div style={{ maxHeight: '201px', overflowY: 'auto' }}>
          {packages.map((pkg, index) => (
            <CCard key={pkg.codPaqueteTransito} className="mb-3">
              <CCardHeader>Tracking: {pkg.tracking}</CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol md="4">
                    <CFormInput
                      type="number"
                      label="Peso volumétrico"
                      value={pkg.volumetricWeight}
                      placeholder="0"
                      onChange={(e) =>
                        updatePackageDetails(index, 'volumetricWeight', e.target.value)
                      }
                    />
                  </CCol>
                  <CCol md="4">
                    <CFormInput
                      type="number"
                      label="Peso real"
                      value={pkg.realWeight}
                      placeholder="0"
                      onChange={(e) => updatePackageDetails(index, 'realWeight', e.target.value)}
                    />
                  </CCol>
                  <CCol md="4">
                    <CFormInput
                      type="text"
                      label="Total"
                      value={pkg.subtotal ? `L ${pkg.subtotal}` : 'L 0.00'}
                      placeholder="L 0.00"
                      disabled
                    />
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          ))}
        </div>

        <CRow className="mt-2 me-5">
          <CCol className="text-end">
            <strong className="fs-5">Subtotal: {subtotal}</strong>
          </CCol>
        </CRow>
        <CRow className="mt-2 me-5">
          <CCol className="text-end">
            <strong className="fs-5">ISV(15%): {totalISV}</strong>
          </CCol>
        </CRow>
        <CRow className="mt-2 me-5">
          <CCol className="text-end">
            <strong className="fs-5">Total a pagar: {grandTotal}</strong>
          </CCol>
        </CRow>
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" onClick={handleClose} disabled={isInvoicing}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleConfirm} disabled={!isFormValid() || isInvoicing}>
          {isInvoicing ? 'Procesando...' : 'Confirmar facturación'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

BillingDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  packageType: PropTypes.string.isRequired,
  packageDetails: PropTypes.array.isRequired,
  fetchData: PropTypes.func.isRequired,
  customerName: PropTypes.string.isRequired,
  cod_customer: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  tip_customer: PropTypes.string.isRequired,
}

export default BillingDetailsModal
