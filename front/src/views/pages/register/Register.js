import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import { cilLockLocked } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'
import { checkEmail } from '../../../services/emailVerifyService.js'
import { SignUp } from '../../../services/signUpService.js'
import { toast } from 'react-hot-toast'
import UserInformation from './information/UserInformation.js'
import DirectionInformation from './information/DirectionInformation.js'

const Register = () => {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [personalInfo, setPersonalInfo] = useState({
    identificacion: '',
    tipodocumento: '',
    nombre: '',
    segundoNombre: '',
    apellido: '',
    fechaNacimiento: '',
    añoNacimiento: '',
    edadValida: false,
  })

  const [addressInfo, setAddressInfo] = useState({
    AREA_COUNTRY: '',
    telefono: '',
    DES_COUNTRY: '',
    pais: '',
    paisNombre: '',
    departamento: '',
    departamentoNombre: '',
    ciudad: '',
    ciudadNombre: '',
  })

  // Validaciones para el correo electrónico
  const validateEmailLength = (email) => {
    if (email.length < 6) {
      toast.error('El correo debe tener al menos 6 caracteres.')
      return false
    }
    if (email.length > 50) {
      toast.error('El correo no puede exceder los 50 caracteres.')
      return false
    }
    return true
  }

  const handleCheckEmail = async () => {
    try {
      const response = await checkEmail(email)
      if (!response.canProceed) {
        toast.error(response.message || 'Correo no válido.')
        return false
      } else {
        return true
      }
    } catch (error) {
      toast.error('Error al verificar el correo.')
      return false
    }
  }

  // Validaciones para la contraseña
  const validatePasswordLength = (password) => {
    if (password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres.')
      return false
    }
    if (password.length > 15) {
      toast.error('La contraseña no puede exceder los 15 caracteres.')
      return false
    }
    return true
  }

  const validateUpperCase = (password) => {
    if (!/[A-Z]/.test(password)) {
      toast.error('La contraseña debe contener al menos una letra mayúscula.')
      return false
    }
    return true
  }

  const validateLowerCase = (password) => {
    if (!/[a-z]/.test(password)) {
      toast.error('La contraseña debe contener al menos una letra minúscula.')
      return false
    }
    return true
  }

  const validateNumber = (password) => {
    if (!/\d/.test(password)) {
      toast.error('La contraseña debe contener al menos un número.')
      return false
    }
    return true
  }

  const validateSpecialCharacter = (password) => {
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      toast.error('La contraseña debe contener al menos un carácter especial.')
      return false
    }
    return true
  }

  const validatePassword = (password) => {
    const validations = [
      validatePasswordLength(password),
      validateUpperCase(password),
      validateLowerCase(password),
      validateNumber(password),
      validateSpecialCharacter(password),
    ]
    return validations.every((validation) => validation === true)
  }

  const handleNextStep = async () => {
    if (step === 1) {
      if (!email || !password || !confirmPassword) {
        toast.error('Todos los campos son requeridos')
        return
      }

      if (!validateEmailLength(email)) {
        return // Detener la ejecución si el correo no es válido
      }

      const isEmailValid = await handleCheckEmail()
      if (!isEmailValid) {
        return // Detener la ejecución si el correo no es válido
      }

      if (password !== confirmPassword) {
        toast.error('Las contraseñas no coinciden')
        return
      }

      if (!validatePassword(password)) {
        return // Detener la ejecución si la contraseña no es válida
      }

      setStep(2)
    } else if (step === 2) {
      const {
        identificacion,
        tipodocumento,
        nombre,
        apellido,
        fechaNacimiento,
        añoNacimiento,
        edadValida,
      } = personalInfo

      if (
        !identificacion ||
        !tipodocumento ||
        !nombre ||
        !apellido ||
        !fechaNacimiento ||
        !añoNacimiento
      ) {
        toast.error('Por favor completa todos los campos')
        return
      }

      if (!edadValida) {
        toast.error('No puede continuar por que la edad es mayor de 100 años o menor 18 años')
        return
      }

      setStep(3)
    } else if (step === 3) {
      const { AREA_COUNTRY, telefono, DES_COUNTRY, pais, departamento, ciudad } = addressInfo
      if (!AREA_COUNTRY || !telefono || !DES_COUNTRY || !pais || !departamento || !ciudad) {
        toast.error('Por favor completa todos los campos de dirección')
        return
      }

      // Aquí añadimos el comportamiento de `toast.promise`
      const signUpPromise = SignUp(email, password, personalInfo, addressInfo)

      toast
        .promise(signUpPromise, {
          loading: 'Registrando...',
          success: 'Registrado con éxito. Ahora verifique su cuenta por medio del correo',
          error: 'Error al registrar usuario',
        })
        .then(() => {
          setTimeout(() => {
            navigate('/login')
          }, 2000) // Redirige después de 2 segundos
        })
        .catch((error) => {
          toast.error(error.message || 'Error al registrar usuario')
        })
    }
  }

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Registro</h1>
                  <p className="text-body-secondary">
                    {step === 1
                      ? 'Crea tu cuenta'
                      : step === 2
                        ? 'Completa tu información personal'
                        : 'Introduce tu dirección'}
                  </p>

                  {step === 1 && (
                    <>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>@</CInputGroupText>
                        <CFormInput
                          type="email"
                          placeholder="Correo electrónico"
                          autoComplete="email"
                          value={email}
                          required
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </CInputGroup>

                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Contraseña"
                          autoComplete="new-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </CInputGroup>

                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Confirmar contraseña"
                          autoComplete="new-password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </CInputGroup>
                    </>
                  )}

                  {step === 2 && (
                    <UserInformation
                      DatosPersonales={personalInfo}
                      set_DatosPersonales={setPersonalInfo}
                    />
                  )}

                  {step === 3 && (
                    <DirectionInformation
                      Datoslocalizacion={addressInfo}
                      set_Datoslocalizacion={setAddressInfo}
                    />
                  )}

                  {/* Botones alineados a la izquierda y derecha */}
                  <div className="d-flex justify-content-between mt-4">
                    {/* Cambia el comportamiento del botón dependiendo del paso */}
                    <CButton
                      color="secondary"
                      onClick={step === 1 ? () => navigate('/login') : handlePreviousStep}
                    >
                      {step === 1 ? 'Atrás' : 'Atrás'}
                    </CButton>
                    <CButton color="primary" onClick={handleNextStep}>
                      {step === 1 ? 'Crear cuenta' : step === 2 ? 'Siguiente' : 'Registrar'}
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
