import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginService } from '../../services/loginService'
import { AuthContext } from '../../actions/authContext'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'
import { toast } from 'react-hot-toast'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)

    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email) {
      toast.error('El correo electrónico es requerido')
      return
    }
    if (!password) {
      toast.error('La contraseña es requerida')
      return
    }

    try {
      const data = await loginService({ email, password })

      localStorage.setItem('Jet-Cargo_jwt_login', data.token)
      localStorage.setItem('Jet-Cargo_refresh_token', data.refreshToken)
      localStorage.setItem('Jet-Cargo_user_data', JSON.stringify(data.user))

      login({
        id: data.user.id,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        role: data.user.role,
        customerId: data.user.customerId,
        permissions: data.user.permissions,
      })

      navigate('/dashboard')
    } catch (error) {
      toast.error(error.message || 'Error en el inicio de sesión. Intenta de nuevo.')
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1>Iniciar Sesión</h1>
                    <p className="text-body-secondary">Ingresa a tu cuenta</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={12} className="mb-3">
                        <CButton color="primary" type="submit" className="px-4 w-100">
                          Ingresar
                        </CButton>
                      </CCol>
                      {isMobile && (
                        <CCol xs={12} className="mb-3">
                          <Link to="/register" className="w-100">
                            <CButton color="primary" className="w-100">
                              Registrarse
                            </CButton>
                          </Link>
                        </CCol>
                      )}
                      <CCol xs={12}>
                        <CButton href="/forgotPassword" color="link" className="px-0">
                          ¿Has olvidado tu contraseña?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              {!isMobile && (
                <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                  <CCardBody className="text-center">
                    <div>
                      <h2>Registrate</h2>
                      <p>
                        Bienvenido a JET CARGO, tu solución confiable para el transporte de paquetes
                        desde Estados Unidos. Nos especializamos en ofrecer un servicio rápido y
                        seguro para que tus paquetes lleguen a su destino sin complicaciones. Únete
                        a nosotros y descubre lo fácil que es recibir paquetes con nosotros.
                      </p>
                      <Link to="/register">
                        <CButton color="primary" className="mt-3" active tabIndex={-1}>
                          Registrarse
                        </CButton>
                      </Link>
                    </div>
                  </CCardBody>
                </CCard>
              )}
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
