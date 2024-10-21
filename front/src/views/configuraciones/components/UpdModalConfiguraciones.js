import React, { useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
} from '@coreui/react'
import { updatePrecio } from '../../../services/precioService'
import { AuthContext } from '../../../actions/authContext'
import { toast } from 'react-hot-toast'

const UpdModalConfiguraciones = ({ precio, onClose, onUpdate }) => {
  const [updatedPrecio, setUpdatedPrecio] = useState('')
  const { user } = useContext(AuthContext)
  const usr_add = user?.firstName

  useEffect(() => {
    if (precio) {
      setUpdatedPrecio(`$ ${Number(precio.PRECIO).toFixed(2)}`)
    }
  }, [precio])

  const handlePrecioChange = (e) => {
    let value = e.target.value.replace('$ ', '')
    const regex = /^(?!0\d)\d{0,8}(\.\d{0,2})?$/

    if (regex.test(value) || value === '') {
      setUpdatedPrecio(value ? `$ ${value}` : '')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const precioNumerico = Number(updatedPrecio.replace('$ ', ''))
      await updatePrecio(precio.COD_PRECIO, precioNumerico, usr_add)
      toast.success('Precio actualizado correctamente')
      onUpdate()
      onClose()
    } catch (error) {
      toast.error(error.message || 'Error al actualizar el precio')
    }
  }

  return (
    <CModal visible={!!precio} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Editar Precio</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="descripcion" className="form-label">
              Descripción
            </label>
            <CFormInput type="text" id="descripcion" value={precio?.DES_PRECIO || ''} disabled />
          </div>
          <div className="mb-3">
            <label htmlFor="precio" className="form-label">
              Precio
            </label>
            <CFormInput
              type="text"
              id="precio"
              value={updatedPrecio}
              onChange={handlePrecioChange}
              placeholder="$ 0.00"
              required
            />
          </div>
          <CModalFooter>
            <CButton color="secondary" onClick={onClose}>
              Cancelar
            </CButton>
            <CButton color="primary" type="submit">
              Guardar Cambios
            </CButton>
          </CModalFooter>
        </CForm>
      </CModalBody>
    </CModal>
  )
}

UpdModalConfiguraciones.propTypes = {
  precio: PropTypes.shape({
    COD_PRECIO: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    DES_PRECIO: PropTypes.string.isRequired,
    PRECIO: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }),
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
}

export default UpdModalConfiguraciones
