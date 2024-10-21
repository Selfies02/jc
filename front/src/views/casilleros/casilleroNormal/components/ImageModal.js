import React from 'react'
import PropTypes from 'prop-types'
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react'

const ImageModal = ({ visible, image, onClose }) => {
  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader onClose={onClose}>
        <CModalTitle>IMAGEN DEL PAQUETE</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <img
          src={image}
          alt="Package"
          style={{ width: '100%', height: '450px', objectFit: 'contain' }}
        />
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cerrar
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

ImageModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  image: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default ImageModal
