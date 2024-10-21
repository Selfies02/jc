import React, { useEffect, useState, useContext } from 'react'
import PropTypes from 'prop-types'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CAlert,
  CButton,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CFormTextarea,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilPencil,
  cilSave,
  cilPhone,
  cilUser,
  cilMap,
  cilLocationPin,
  cilGlobeAlt,
  cilX,
} from '@coreui/icons'
import { InputMask } from 'primereact/inputmask'
import { getUserDetails, updateUserDetails } from '../../services/userService.js'
import { AuthContext } from '../../actions/authContext.js'
import ChangePassword from './components/ChangePassword.js'
import { CountryService, StateService, CityService } from '../../services/directionService.js'
import { SelectCity } from '../pages/register/select/SelectCity.js'
import { SelectCountry } from '../pages/register/select/SelectCountry.js'
import { SelectState } from '../pages/register/select/SelectState.js'
import { toast } from 'react-hot-toast'

const InputField = ({
  label,
  id,
  value,
  displayValue,
  icon,
  mask,
  onChange,
  isEditing,
  isTextarea,
  isSelect,
  options,
  disabled,
}) => (
  <CCol xs={12} md={6} className="mb-4">
    <label htmlFor={id} className="form-label">
      <strong>{label}:</strong>
    </label>
    {isEditing ? (
      <CInputGroup>
        <CInputGroupText>
          {id === 'CORREO_ELECTRONICO' ? '@' : <CIcon icon={icon} />}
        </CInputGroupText>
        {id === 'TELEFONO' ? (
          <InputMask
            id={id}
            value={value}
            onChange={(e) => onChange(id, e.value)}
            mask={mask}
            placeholder="9999-9999"
            slotChar="_"
            className="form-control"
            disabled={disabled}
          />
        ) : isTextarea ? (
          <CFormTextarea
            id={id}
            value={value}
            onChange={(e) => onChange(id, e.target.value)}
            rows={3}
            disabled={disabled}
          />
        ) : isSelect ? (
          <CFormSelect
            id={id}
            value={value}
            onChange={(e) => onChange(id, e.target.value)}
            disabled={disabled}
          >
            <option value="">-- Seleccione una opción --</option>
            {options}
          </CFormSelect>
        ) : (
          <CFormInput
            id={id}
            value={value}
            onChange={(e) => onChange(id, e.target.value)}
            disabled={disabled}
          />
        )}
      </CInputGroup>
    ) : (
      <p>{displayValue || value}</p>
    )}
  </CCol>
)

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  displayValue: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.array, PropTypes.string]).isRequired,
  mask: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isTextarea: PropTypes.bool,
  isSelect: PropTypes.bool,
  options: PropTypes.node,
  disabled: PropTypes.bool,
}

const Perfil = () => {
  const [userDetails, setUserDetails] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const { user } = useContext(AuthContext)
  const [apiCountries, setApiCountries] = useState([])
  const [apiStates, setApiStates] = useState([])
  const [apiCities, setApiCities] = useState([])
  const [loadingCountry, setLoadingCountry] = useState(false)
  const [loadingState, setLoadingState] = useState(false)
  const [loadingCity, setLoadingCity] = useState(false)
  const [originalUserDetails, setOriginalUserDetails] = useState(null)

  useEffect(() => {
    if (user && user.id) {
      getUserDetails(user.id)
        .then((data) => {
          const formattedData = Object.entries(data).reduce((acc, [key, value]) => {
            acc[key] = typeof value === 'number' ? value.toString() : value
            return acc
          }, {})
          setUserDetails(formattedData)
          setOriginalUserDetails(formattedData)
        })
        .catch((error) => {
          toast.error('Ocurrió un error al obtener los detalles del usuario. Intente nuevamente.')
        })
    }
  }, [user])

  const fetchCountries = async () => {
    setLoadingCountry(true)
    try {
      const countryData = await CountryService()
      if (Array.isArray(countryData)) {
        setApiCountries(countryData)
      } else {
        throw new Error('Country no es un array o está vacío')
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoadingCountry(false)
    }
  }

  const fetchStates = async (countryCode) => {
    setLoadingState(true)
    try {
      const statesResponse = await StateService(countryCode)
      if (Array.isArray(statesResponse)) {
        const uniqueStates = Array.from(
          new Map(statesResponse.map((state) => [state.COD_STATE, state])).values(),
        )
        setApiStates(uniqueStates)
      } else {
        throw new Error('State no es un array o está vacío')
      }
    } catch (error) {
      toast.error(error.message)
      setApiStates([])
    } finally {
      setLoadingState(false)
    }
  }

  const fetchCities = async (stateCode) => {
    setLoadingCity(true)
    try {
      const citiesResponse = await CityService(stateCode)
      if (Array.isArray(citiesResponse)) {
        setApiCities(citiesResponse)
      } else {
        throw new Error('Error: No hay ciudades disponibles')
      }
    } catch (error) {
      toast.error(error.message)
      setApiCities([])
    } finally {
      setLoadingCity(false)
    }
  }

  const handleEditClick = async () => {
    setIsEditing(true)
    setOriginalUserDetails({ ...userDetails })
    await fetchCountries()
    if (userDetails.COD_COUNTRY) {
      await fetchStates(userDetails.COD_COUNTRY)
    }
    if (userDetails.COD_STATE) {
      await fetchCities(userDetails.COD_STATE)
    }
  }

  const handleSaveClick = async () => {
    try {
      const updatedDetails = {
        cod_user: user.id,
        firstname: userDetails.FIRSTNAME,
        middlename: userDetails.MIDDLENAME,
        lastname: userDetails.LASTNAME,
        email: userDetails.CORREO_ELECTRONICO,
        num_phone: userDetails.TELEFONO,
        cod_country: userDetails.COD_COUNTRY,
        cod_state: userDetails.COD_STATE,
        cod_city: userDetails.COD_CITY,
        des_address: userDetails.DIRECCION,
        usr_upd: user.firstName,
      }

      const response = await updateUserDetails(updatedDetails)

      toast.success(response.message)
      setIsEditing(false)
    } catch (error) {
      toast.error('Error al actualizar los detalles del usuario')
    }
  }

  const handleCancelClick = () => {
    setUserDetails(originalUserDetails)
    setIsEditing(false)
  }

  const handleInputChange = (field, value) => {
    const regex = /^[A-Za-záéíóúÁÉÍÓÚñÑ]{3,30}$/

    if (
      (field === 'FIRSTNAME' || field === 'MIDDLENAME' || field === 'LASTNAME') &&
      !regex.test(value) &&
      value !== ''
    ) {
      return
    }

    if (field === 'CORREO_ELECTRONICO' && (value.length < 6 || value.length > 50)) {
      return
    }

    setUserDetails({ ...userDetails, [field]: value })

    if (field === 'COD_COUNTRY') {
      handleCountryChange(value)
    } else if (field === 'COD_STATE') {
      handleStateChange(value)
    } else if (field === 'COD_CITY') {
      handleCityChange(value)
    }
  }

  const handleCountryChange = async (countryCode) => {
    const selectedCountry = apiCountries.find((country) => country.COD_COUNTRY === countryCode)
    setUserDetails({
      ...userDetails,
      COD_COUNTRY: countryCode,
      PAIS: selectedCountry ? selectedCountry.DES_COUNTRY : '',
      COD_STATE: '',
      ESTADO: '',
      COD_CITY: '',
      CIUDAD: '',
    })

    await fetchStates(countryCode)
    setApiCities([])
  }

  const handleStateChange = async (stateCode) => {
    const selectedState = apiStates.find((state) => state.COD_STATE === stateCode)
    setUserDetails({
      ...userDetails,
      COD_STATE: stateCode,
      ESTADO: selectedState ? selectedState.DES_STATE : '',
      COD_CITY: '',
      CIUDAD: '',
    })

    await fetchCities(stateCode)
  }

  const handleCityChange = (cityCode) => {
    const selectedCity = apiCities.find((city) => city.COD_CITY === cityCode)
    setUserDetails({
      ...userDetails,
      COD_CITY: cityCode,
      CIUDAD: selectedCity ? selectedCity.DES_CITY : '',
    })
  }

  const handleChangePasswordClick = () => {
    setIsChangingPassword(true)
  }

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false)
  }

  if (!user) {
    return <CAlert color="warning">User data not found. Please make sure you are logged in.</CAlert>
  }

  if (!userDetails) {
    return <CAlert color="info">Loading user details...</CAlert>
  }

  return (
    <CRow className="justify-content-center">
      <CCol xs={12} lg={10} xl={8}>
        <CCard className="shadow-lg border-0">
          <CCardHeader className="bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              {isChangingPassword ? 'Cambio de contraseña' : 'Perfil de usuario'}
            </h5>
            <div>
              {!isChangingPassword && (
                <>
                  {isEditing ? (
                    <>
                      <CButton color="light" size="sm" onClick={handleSaveClick} className="me-2">
                        <CIcon icon={cilSave} /> Guardar
                      </CButton>
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={handleCancelClick}
                        className="me-2"
                      >
                        <CIcon icon={cilX} /> Cancelar
                      </CButton>
                    </>
                  ) : (
                    <CButton color="light" size="sm" onClick={handleEditClick} className="me-2">
                      <CIcon icon={cilPencil} /> Editar perfil
                    </CButton>
                  )}
                </>
              )}
              {!isChangingPassword && !isEditing && (
                <CButton color="light" size="sm" onClick={handleChangePasswordClick}>
                  Cambiar contraseña
                </CButton>
              )}
            </div>
          </CCardHeader>
          <CCardBody>
            {isChangingPassword ? (
              <ChangePassword onCancel={handleCancelPasswordChange} />
            ) : (
              <CForm
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSaveClick()
                }}
              >
                <CRow>
                  <InputField
                    label="Primer nombre"
                    id="FIRSTNAME"
                    value={userDetails.FIRSTNAME}
                    icon={cilUser}
                    onChange={handleInputChange}
                    isEditing={isEditing}
                  />
                  <InputField
                    label="Segundo nombre"
                    id="MIDDLENAME"
                    value={userDetails.MIDDLENAME || 'N/A'}
                    icon={cilUser}
                    onChange={handleInputChange}
                    isEditing={isEditing}
                  />
                  <InputField
                    label="Apellido"
                    id="LASTNAME"
                    value={userDetails.LASTNAME}
                    icon={cilUser}
                    onChange={handleInputChange}
                    isEditing={isEditing}
                  />
                  <InputField
                    label="Teléfono"
                    id="TELEFONO"
                    value={userDetails.TELEFONO}
                    icon={cilPhone}
                    mask="9999-9999"
                    onChange={handleInputChange}
                    isEditing={isEditing}
                  />
                  <InputField
                    label="Correo"
                    id="CORREO_ELECTRONICO"
                    value={userDetails.CORREO_ELECTRONICO}
                    icon={cilUser}
                    onChange={handleInputChange}
                    isEditing={isEditing}
                  />
                  <InputField
                    label="País"
                    id="COD_COUNTRY"
                    value={userDetails.COD_COUNTRY}
                    displayValue={userDetails.PAIS}
                    icon={cilGlobeAlt}
                    onChange={handleInputChange}
                    isEditing={isEditing}
                    isSelect={true}
                    options={
                      loadingCountry ? (
                        <option disabled>Cargando países...</option>
                      ) : (
                        <SelectCountry ApiCountry={apiCountries} />
                      )
                    }
                    disabled={!isEditing}
                  />
                  <InputField
                    label="Estado"
                    id="COD_STATE"
                    value={userDetails.COD_STATE}
                    displayValue={userDetails.ESTADO}
                    icon={cilGlobeAlt}
                    onChange={handleInputChange}
                    isEditing={isEditing}
                    isSelect={true}
                    options={
                      loadingState ? (
                        <option disabled>Cargando estados...</option>
                      ) : (
                        <SelectState ApiState={apiStates} />
                      )
                    }
                    disabled={!isEditing || !userDetails.COD_COUNTRY}
                  />
                  <InputField
                    label="Ciudad"
                    id="COD_CITY"
                    value={userDetails.COD_CITY}
                    displayValue={userDetails.CIUDAD}
                    icon={cilGlobeAlt}
                    onChange={handleInputChange}
                    isEditing={isEditing}
                    isSelect={true}
                    options={
                      loadingCity ? (
                        <option disabled>Cargando ciudades...</option>
                      ) : (
                        <SelectCity ApiCities={apiCities} />
                      )
                    }
                    disabled={!isEditing || !userDetails.COD_STATE}
                  />
                  <InputField
                    label="Dirección"
                    id="DIRECCION"
                    value={userDetails.DIRECCION}
                    icon={cilLocationPin}
                    onChange={handleInputChange}
                    isEditing={isEditing}
                    isTextarea
                  />
                </CRow>
              </CForm>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Perfil
