import React from 'react'
import PropTypes from 'prop-types'
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CRow, CCol } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilCalendar, cilFingerprint, cilChart } from '@coreui/icons'
import { InputMask } from 'primereact/inputmask'
import { toast } from 'react-hot-toast'

const UserInformation = ({ DatosPersonales = {}, set_DatosPersonales }) => {
  // Función para calcular la edad basada en la fecha de nacimiento
  const FechaNacimiento = (e) => {
    const fechaNac = e.target.value
    const hoy = new Date()
    const cumpleanos = new Date(fechaNac)
    let edad = hoy.getFullYear() - cumpleanos.getFullYear()
    const mes = hoy.getMonth() - cumpleanos.getMonth()

    if (mes < 0 || (mes === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--
    }

    if (edad > 100) {
      toast.error('La edad no puede ser mayor de 100 años')
      set_DatosPersonales({
        ...DatosPersonales,
        fechaNacimiento: fechaNac,
        añoNacimiento: edad.toString(),
        edadValida: false,
      })
      return // Salir de la función para no actualizar más datos
    }

    // Mostrar advertencia si la edad es menor de 18 años
    if (edad < 18) {
      toast.error('No puede ingresar una persona menor de edad')
      set_DatosPersonales({
        ...DatosPersonales,
        fechaNacimiento: fechaNac,
        añoNacimiento: edad.toString(), // Guardar la edad calculada
        edadValida: false, // La edad no es válida si es menor de 18
      })
    } else {
      set_DatosPersonales({
        ...DatosPersonales,
        fechaNacimiento: fechaNac,
        añoNacimiento: edad.toString(), // Guardar la edad calculada
        edadValida: true, // La edad es válida si es mayor o igual a 18
      })
    }
  }

  // Función de validación para los nombres
  const handleNombreChange = (e) => {
    const { value } = e.target
    // Solo permitir letras (a-z, A-Z) y espacios, sin números ni caracteres especiales
    if (/^[a-zA-Z\s]*$/.test(value) && value.length <= 30) {
      set_DatosPersonales({
        ...DatosPersonales,
        nombre: value,
      })
    }
  }

  const handleApellidoChange = (e) => {
    const { value } = e.target
    // Solo permitir letras (a-z, A-Z) y espacios, sin números ni caracteres especiales
    if (/^[a-zA-Z\s]*$/.test(value) && value.length <= 30) {
      set_DatosPersonales({
        ...DatosPersonales,
        apellido: value,
      })
    }
  }

  const handleSegundoNombreChange = (e) => {
    const { value } = e.target
    if (value.length <= 30) {
      set_DatosPersonales({
        ...DatosPersonales,
        segundoNombre: value,
      })
    }
  }

  return (
    <>
      <CInputGroup className="mb-3">
        <CInputGroupText>
          <CIcon icon={cilFingerprint} />
        </CInputGroupText>
        <InputMask
          className="form-control"
          id="basic"
          placeholder="Identidad"
          mask="9999-9999-99999"
          value={DatosPersonales.identificacion || ''}
          onChange={(e) =>
            set_DatosPersonales({
              ...DatosPersonales,
              identificacion: e.target.value,
            })
          }
        />
      </CInputGroup>

      <CInputGroup className="mb-3">
        <CInputGroupText>
          <CIcon icon={cilUser} />
        </CInputGroupText>
        <CFormSelect
          onChange={(e) => {
            set_DatosPersonales({
              ...DatosPersonales,
              tipodocumento: e.target.value,
            })
          }}
          value={DatosPersonales.tipodocumento || ''}
        >
          <option value="">-- Seleccione Tipo Documento --</option>
          <option value="ID">ID</option>
          <option value="PASSPORT">PASAPORTE</option>
          <option value="LICENSE">LICENCIA</option>
        </CFormSelect>
      </CInputGroup>

      <CRow>
        <CCol md={6}>
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilUser} />
            </CInputGroupText>
            <CFormInput
              type="text"
              placeholder="Primer Nombre"
              value={DatosPersonales.nombre || ''}
              onChange={handleNombreChange}
            />
          </CInputGroup>
        </CCol>

        <CCol md={6}>
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilUser} />
            </CInputGroupText>
            <CFormInput
              type="text"
              placeholder="Segundo Nombre"
              value={DatosPersonales.segundoNombre || ''}
              onChange={handleSegundoNombreChange}
            />
          </CInputGroup>
        </CCol>
      </CRow>

      <CInputGroup className="mb-3">
        <CInputGroupText>
          <CIcon icon={cilUser} />
        </CInputGroupText>
        <CFormInput
          type="text"
          placeholder="Apellidos"
          value={DatosPersonales.apellido || ''}
          onChange={handleApellidoChange}
        />
      </CInputGroup>

      <CRow>
        <CCol md={6}>
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilCalendar} />
            </CInputGroupText>
            <CFormInput
              type="date"
              value={DatosPersonales.fechaNacimiento || ''}
              onChange={FechaNacimiento}
            />
          </CInputGroup>
        </CCol>

        <CCol md={6}>
          <CInputGroup className="mb-4">
            <CInputGroupText>
              <CIcon icon={cilChart} />
            </CInputGroupText>
            <CFormInput
              type="text"
              value={DatosPersonales.añoNacimiento || ''}
              readOnly
              placeholder="Edad calculada"
            />
          </CInputGroup>
        </CCol>
      </CRow>
    </>
  )
}

UserInformation.propTypes = {
  DatosPersonales: PropTypes.shape({
    identificacion: PropTypes.string,
    tipodocumento: PropTypes.string,
    nombre: PropTypes.string,
    segundoNombre: PropTypes.string,
    apellido: PropTypes.string,
    fechaNacimiento: PropTypes.string,
    añoNacimiento: PropTypes.string,
    edadValida: PropTypes.bool,
  }),
  set_DatosPersonales: PropTypes.func.isRequired,
}

export default UserInformation
