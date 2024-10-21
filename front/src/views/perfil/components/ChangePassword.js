import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { CCardBody, CFormInput, CButton, CAlert } from '@coreui/react'
import { AuthContext } from '../../../actions/authContext.js'
import { changePasswordService } from '../../../services/userService.js'
import { toast } from 'react-hot-toast'

const ChangePassword = ({ onCancel }) => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(null)
  const [validationErrors, setValidationErrors] = useState([])
  const { user } = useContext(AuthContext)

  const validatePassword = (password) => {
    const errors = []
    if (password.length < 8 || password.length > 15) {
      errors.push('La contraseña debe tener entre 8 y 15 caracteres.')
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra mayúscula.')
    }
    if (!/[a-z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra minúscula.')
    }
    if (!/\d/.test(password)) {
      errors.push('La contraseña debe contener al menos un número.')
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) {
      errors.push('La contraseña debe contener al menos un carácter especial.')
    }
    return errors
  }

  const handleNewPasswordChange = (e) => {
    const password = e.target.value
    setNewPassword(password)
    setValidationErrors(validatePassword(password))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError(null)

    const errors = validatePassword(newPassword)
    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    try {
      const response = await changePasswordService({
        cod_user: user.id,
        new_password: newPassword,
        usr_upd: user.firstName,
      })

      if (response.success) {
        toast.success('Contraseña cambiada exitosamente')
        onCancel()
      } else {
        toast.error(response.message || 'Error al cambiar la contraseña')
      }
    } catch (error) {
      toast.error('Ocurrió un error al cambiar la contraseña. Por favor, inténtalo de nuevo.')
    }
  }

  return (
    <CCardBody>
      {message && <CAlert color="success">{message}</CAlert>}
      {error && <CAlert color="danger">{error}</CAlert>}
      {validationErrors.length > 0 && (
        <CAlert color="warning">
          <ul>
            {validationErrors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </CAlert>
      )}
      <CFormInput
        type="password"
        id="newPassword"
        label="Nueva Contraseña"
        value={newPassword}
        onChange={handleNewPasswordChange}
        required
        className="mb-3"
      />
      <CFormInput
        type="password"
        id="confirmPassword"
        label="Confirmar Nueva Contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        className="mb-3"
      />
      <div className="d-flex justify-content-end">
        <CButton type="button" color="secondary" onClick={onCancel} className="me-2">
          Cancelar
        </CButton>
        <CButton
          type="button"
          color="primary"
          onClick={handleSubmit}
          disabled={validationErrors.length > 0 || !newPassword || !confirmPassword}
        >
          Cambiar Contraseña
        </CButton>
      </div>
    </CCardBody>
  )
}

ChangePassword.propTypes = {
  onCancel: PropTypes.func.isRequired,
}

export default ChangePassword
