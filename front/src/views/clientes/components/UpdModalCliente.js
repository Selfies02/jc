import React, { useEffect, useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-hot-toast'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
  CFormSelect,
  CFormCheck,
} from '@coreui/react'
import { updateCustomerStateAndTypeService } from '../../../services/customerService'
import '../css/toggleSwitch.css'
import { AuthContext } from '../../../actions/authContext'

const UpdModalClientes = ({ client, onClose, onUpdate }) => {
  const { user } = useContext(AuthContext)
  const usr_add = user?.firstName
  const [formData, setFormData] = useState({
    fullName: '',
    customerType: '',
    status: true,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (client) {
      setFormData({
        fullName:
          `${client.FIRSTNAME || ''} ${client.MIDDLENAME || ''} ${client.LASTNAME || ''}`.trim(),
        customerType: client.IND_TYPCUST || '',
        status: client.IND_USR === 1 || client.IND_USR === '1' || client.IND_USR === true,
      })
    }
  }, [client])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = () => {
    setFormData((prev) => ({ ...prev, status: !prev.status }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const codUser = client.COD_USER
    const newIndUsr = formData.status ? 1 : 0
    const newIndTypCust = formData.customerType

    try {
      await updateCustomerStateAndTypeService(codUser, newIndUsr, newIndTypCust, usr_add)
      onUpdate(formData)
      onClose()
      toast.success('Cliente actualizado exitosamente')
    } catch (error) {
      toast.error(error.message || 'Error al actualizar el cliente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CModal visible={!!client} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Editar Cliente</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <form onSubmit={handleSubmit}>
          <CFormInput
            className="mb-3"
            label="Cliente"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            disabled
          />
          <CFormSelect
            className="mb-3"
            label="Tipo de cliente"
            name="customerType"
            value={formData.customerType}
            onChange={handleChange}
            options={[
              { label: 'Natural', value: 'N' },
              { label: 'Emprendedor', value: 'E' },
            ]}
            required
          />
          <div className="mb-3">
            <label className="form-label">Estado del cliente</label>
            <div className="toggle-switch">
              <CFormCheck
                type="checkbox"
                id="customSwitch"
                checked={formData.status}
                onChange={handleCheckboxChange}
                label=""
              />
              <label htmlFor="customSwitch" className={`switch ${formData.status ? 'active' : ''}`}>
                <span className="switch-text"></span>
                <span className="switch-text"></span>
              </label>
            </div>
          </div>
        </form>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

UpdModalClientes.propTypes = {
  client: PropTypes.shape({
    FIRSTNAME: PropTypes.string,
    MIDDLENAME: PropTypes.string,
    LASTNAME: PropTypes.string,
    IND_TYPCUST: PropTypes.string,
    IND_USR: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
    COD_USER: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
}

export default UpdModalClientes
