import React from 'react'
import PropTypes from 'prop-types'
import { CModal, CModalBody, CModalHeader, CModalFooter, CModalTitle, CButton } from '@coreui/react'

const ConfirmModal = ({ visible, onClose, onConfirm, reportType, isReporting }) => {
  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader closeButton>
        <CModalTitle>Confirmación</CModalTitle>
      </CModalHeader>
      <CModalBody className="text-center">
        {isReporting ? (
          'Enviando notificaciones a los clientes...'
        ) : (
          <>
            {`¿Deseas actualizar los paquetes para `}
            <strong className="text-primary" style={{ fontSize: '1.3em' }}>
              {reportType}
            </strong>
            {`?`}
          </>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose} disabled={isReporting}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={onConfirm} disabled={isReporting}>
          Confirmar
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

ConfirmModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  reportType: PropTypes.string,
  isReporting: PropTypes.bool.isRequired,
}

export default ConfirmModal
