import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CRow,
  CFormLabel,
  CInputGroupText,
  CInputGroup,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft } from '@coreui/icons'
import { Toaster, toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { sendResetEmail } from '../../services/passResetService.js'
import * as Yup from 'yup'

const ResetSchema = Yup.object().shape({
  email: Yup.string()
    .email('Correo electrónico no válido')
    .required('Correo electrónico es requerido'),
})

const ForgotPassword = () => {
  const [resetpass, set_resetpass] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    let formData = { email: resetpass }
    const isValid = await ResetSchema.isValid(formData)
    if (!isValid) {
      toast.error('El correo electrónico es requerido', { duration: 6000 })
      return
    }
    try {
      const callback = sendResetEmail(resetpass)
      toast
        .promise(callback, {
          loading: 'Enviando',
          success: 'Email enviado',
          error: 'Correo electrónico no válido',
        })
        .then(() =>
          setTimeout(() => {
            navigate('/login')
          }, 2000),
        )
    } catch (error) {
      toast.error('Ocurrió un error al enviar el correo de reinicio. Intente nuevamente.')
    }
  }

  const handleLogin = () => {
    navigate('/login')
  }

  return (
    <>
      <Toaster />
      <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={9} lg={7} xl={6}>
              <CCard className="mx-4">
                <CCardBody className="p-4">
                  <CRow>
                    <CCol>
                      <CForm onSubmit={handleSubmit}>
                        <div className="mb-3 d-flex align-items-center">
                          <CFormLabel className="me-2">Ingrese su correo electrónico</CFormLabel>
                        </div>
                        <CInputGroup className="mb-3">
                          <CInputGroupText>@</CInputGroupText>
                          <CFormInput
                            type="email"
                            placeholder="Correo electrónico"
                            onChange={(e) => set_resetpass(e.target.value)}
                          />
                        </CInputGroup>
                        <div className="invalid-feedback">Por favor, ingrese un correo válido.</div>
                        <div className="d-flex justify-content-between mt-3">
                          <CButton color="secondary" onClick={handleLogin} className="me-2 w-25">
                            <CIcon icon={cilArrowLeft} className="me-2" />
                          </CButton>
                          <CButton color="primary" type="submit" className="w-75">
                            Recuperar contraseña
                          </CButton>
                        </div>
                      </CForm>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  )
}

export default ForgotPassword
