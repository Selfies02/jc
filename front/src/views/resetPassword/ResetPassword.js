import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CRow,
  CAlert,
  CInputGroupText,
  CInputGroup,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'
import { toast } from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { resetPassword } from '../../services/passResetService.js'
import { jwtDecode } from 'jwt-decode'

const ResetPassword = ({ SpinnerLoader }) => {
  const { token } = useParams()
  const [newPassword, set_newPassword] = useState({
    password: '',
    confirpassword: '',
  })
  const [isValidPassword, set_isValidPassword] = useState(true)
  const [viewPassword, set_viewPassword] = useState(false)
  const [userId, setUserId] = useState(null)
  const [tokenError, setTokenError] = useState(false)
  const [nombre, setNombre] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (token && typeof token === 'string') {
      try {
        const decoded = jwtDecode(token)
        setUserId(decoded.cod_user)
        setNombre(decoded.nombre)
      } catch (error) {
        setTokenError(true)
      }
    } else {
      setTokenError(true)
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (tokenError || !userId) {
      toast.error('Token inválido o expirado', { duration: 6000 })
      return
    }

    if (newPassword.password !== newPassword.confirpassword) {
      toast.error('Las contraseñas no coinciden', { duration: 6000 })
      return set_isValidPassword(false)
    }

    try {
      const callback = resetPassword(userId, newPassword.password, nombre)
      toast
        .promise(callback, {
          loading: 'Cambiando contraseña...',
          success: 'Contraseña cambiada con éxito',
          error: 'Error al cambiar la contraseña. Inténtalo de nuevo.',
        })
        .then(() => {
          setTimeout(() => {
            navigate('/login')
          }, 2000)
        })
      set_isValidPassword(true)
    } catch (error) {
      toast.error('Ocurrió un problema al cambiar la contraseña. Por favor, inténtalo de nuevo.')
    }
  }

  const handleLogin = () => {
    navigate('/login')
  }

  if (tokenError) {
    return (
      <CContainer className="h-100 d-flex align-items-center justify-content-center">
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CAlert color="danger">
              Token inválido o expirado. Por favor, solicite un nuevo enlace para restablecer la
              contraseña.
              <CButton color="primary" onClick={handleLogin} className="w-100 mt-3">
                Volver al login
              </CButton>
            </CAlert>
          </CCol>
        </CRow>
      </CContainer>
    )
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                {SpinnerLoader ? (
                  <div className="d-flex justify-content-center">
                    <CButton disabled>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Cargando...
                    </CButton>
                  </div>
                ) : (
                  <CForm onSubmit={handleSubmit}>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type={viewPassword ? 'text' : 'password'}
                        placeholder="Nueva contraseña"
                        onChange={(e) =>
                          set_newPassword({ ...newPassword, password: e.target.value })
                        }
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type={viewPassword ? 'text' : 'password'}
                        placeholder="Confirmar contraseña"
                        onChange={(e) =>
                          set_newPassword({ ...newPassword, confirpassword: e.target.value })
                        }
                      />
                    </CInputGroup>
                    <div className="form-check mt-3">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="viewPassword"
                        onClick={() => set_viewPassword(!viewPassword)}
                      />
                      <label className="form-check-label" htmlFor="viewPassword">
                        Mostrar contraseña
                      </label>
                    </div>
                    <CButton color="primary" type="submit" className="w-100 mt-3">
                      Confirmar
                    </CButton>
                  </CForm>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

ResetPassword.propTypes = {
  SpinnerLoader: PropTypes.bool,
}

export default ResetPassword
