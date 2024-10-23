import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
  CFormSelect,
} from '@coreui/react'
import { toast } from 'react-hot-toast'
import { insertPackage } from '../../../services/packageService.js'

const AddPackageModal = ({
  visible,
  setVisible,
  trackingNumber,
  setTrackingNumber,
  handleAddPackage,
  fullName,
  virtualLockers,
  lockerMapping,
  selectedLocker,
  setSelectedLocker,
  codCustomer,
}) => {
  const [previewImage, setPreviewImage] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [isButtonEnabled, setIsButtonEnabled] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setIsButtonEnabled(!!trackingNumber && !!selectedLocker && !!photo && !!codCustomer)
  }, [trackingNumber, selectedLocker, photo, codCustomer])

  const handleImagePreview = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
      setPhoto(file)
    }
  }

  const clearImage = () => {
    setPreviewImage(null)
    setPhoto(null)
  }

  const handleSubmit = async () => {
    if (!trackingNumber || !selectedLocker || !photo || !codCustomer) {
      toast.error('Por favor, complete todos los campos antes de agregar el paquete.')
      return
    }

    setIsSubmitting(true)

    const lockerCode = lockerMapping[selectedLocker]

    const formData = new FormData()
    formData.append('cod_customer', codCustomer)
    formData.append('cod_locker', lockerCode)
    formData.append('tracking', trackingNumber)
    formData.append('imagen', photo)

    try {
      await toast.promise(insertPackage(formData), {
        loading: 'Agregando paquete...',
        success: (response) => response.message || 'Paquete agregado correctamente.',
        error: (error) => error.message || 'Error al insertar el paquete.',
      })
      handleAddPackage(photo)
      setVisible(false)
      clearImage()
    } catch (error) {
      toast.error(error.message || 'Error al insertar paquete:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <CModal
      visible={visible}
      onClose={() => {
        if (!isSubmitting) {
          setVisible(false)
          clearImage()
        }
      }}
      backdrop="static"
    >
      <CModalHeader>
        Agregar Paquete para:<span style={{ marginLeft: '4.5px' }}></span>
        <strong className="text-primary">{fullName}</strong>
      </CModalHeader>
      <CModalBody>
        <div className="mb-3">
          <CFormSelect
            label="Seleccionar Casillero Virtual"
            value={selectedLocker}
            onChange={(e) => setSelectedLocker(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="">-- Seleccione un casillero --</option>
            {virtualLockers.map((locker, index) => (
              <option key={index} value={locker}>
                {locker}
              </option>
            ))}
          </CFormSelect>
        </div>
        <div className="mb-3">
          <CFormInput
            type="text"
            label="Número de Tracking"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Ingrese el número de tracking"
            disabled={isSubmitting}
          />
        </div>
        <div className="mb-3">
          <CFormInput
            type="file"
            label="Foto"
            name="imagen"
            onChange={handleImagePreview}
            disabled={isSubmitting}
          />
        </div>

        {previewImage && (
          <div className="mb-3 text-center">
            <img
              src={previewImage}
              alt="Vista previa"
              style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }}
            />
          </div>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={handleSubmit} disabled={!isButtonEnabled || isSubmitting}>
          {isSubmitting ? 'Agregando...' : 'Agregar'}
        </CButton>
        <CButton
          color="secondary"
          onClick={() => {
            if (!isSubmitting) {
              setVisible(false)
              clearImage()
            }
          }}
          disabled={isSubmitting}
        >
          Cancelar
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

AddPackageModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  trackingNumber: PropTypes.string.isRequired,
  setTrackingNumber: PropTypes.func.isRequired,
  handleAddPackage: PropTypes.func.isRequired,
  fullName: PropTypes.string.isRequired,
  virtualLockers: PropTypes.arrayOf(PropTypes.string).isRequired,
  lockerMapping: PropTypes.object.isRequired,
  selectedLocker: PropTypes.string.isRequired,
  setSelectedLocker: PropTypes.func.isRequired,
  codCustomer: PropTypes.number,
}

export default AddPackageModal
