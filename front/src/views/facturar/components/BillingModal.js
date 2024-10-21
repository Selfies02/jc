import React from 'react'
import PropTypes from 'prop-types'
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react'

const BillingModal = ({
  isOpen,
  onClose,
  onConfirm,
  normalPackages,
  expressPackages,
  customerName,
  cod_customer,
  tip_customer,
}) => {
  return (
    <CModal visible={isOpen} onClose={onClose} backdrop="static">
      <CModalHeader>
        <CModalTitle>Seleccione el tipo de facturación</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p>Facturando para: {customerName}</p>
        <p>Paquetes Normales: {normalPackages}</p>
        <p>Paquetes Express: {expressPackages}</p>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cancelar
        </CButton>
        <CButton
          color="primary"
          onClick={() => onConfirm('normal', cod_customer)}
          disabled={normalPackages === 0}
        >
          Paquetes Normales
        </CButton>
        <CButton
          color="primary"
          onClick={() => onConfirm('express', cod_customer)}
          disabled={expressPackages === 0}
        >
          Paquetes Express
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

BillingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  normalPackages: PropTypes.number.isRequired,
  expressPackages: PropTypes.number.isRequired,
  customerName: PropTypes.string.isRequired,
  cod_customer: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  tip_customer: PropTypes.string.isRequired,
}

export default BillingModal
