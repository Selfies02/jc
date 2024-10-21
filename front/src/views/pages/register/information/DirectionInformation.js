import React, { useState, useEffect } from 'react'
import { CInputGroup, CInputGroupText, CFormSelect } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLocationPin, cilPhone, cilGlobeAlt } from '@coreui/icons'
import { CountryService, StateService, CityService } from '../../../../services/directionService.js'
import { SelectCity } from '../select/SelectCity.js'
import { SelectCountry } from '../select/SelectCountry.js'
import { SelectState } from '../select/SelectState.js'
import { SelectArea } from '../select/SelectArea.js'
import PropTypes from 'prop-types'
import { InputMask } from 'primereact/inputmask'
import toast from 'react-hot-toast'

const DirectionInformation = ({ Datoslocalizacion, set_Datoslocalizacion }) => {
  const [ApiCities, set_ApiCities] = useState([])
  const [ApiCountry, set_ApiCountry] = useState([])
  const [ApiState, set_ApiState] = useState([])
  const [Pais, set_pais] = useState(null)
  const [State, set_state] = useState(null)
  const [loadingCountry, setLoadingCountry] = useState(true)
  const [loadingState, setLoadingState] = useState(false)
  const [loadingCity, setLoadingCity] = useState(false)
  const [telefono, setTelefono] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const countryData = await CountryService()
        if (Array.isArray(countryData)) {
          set_ApiCountry(countryData)
        } else {
          toast.error('Country no es un array o está vacío')
        }
      } catch (error) {
        toast.error('Error al obtener países')
      } finally {
        setLoadingCountry(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (Pais) {
      const fetchStates = async () => {
        setLoadingState(true)
        try {
          const statesResponse = await StateService(Pais)
          if (Array.isArray(statesResponse)) {
            const uniqueStates = Array.from(
              new Map(statesResponse.map((state) => [state.COD_STATE, state])).values(),
            )
            set_ApiState(uniqueStates)
          } else {
            toast.error('State no es un array o está vacío')
            set_ApiState([])
          }
        } catch (error) {
          toast.error('Error al obtener estados')
        } finally {
          setLoadingState(false)
        }
      }

      fetchStates()
    }
  }, [Pais])

  useEffect(() => {
    if (State && State.COD_STATE) {
      const fetchCities = async () => {
        setLoadingCity(true)
        try {
          const citiesResponse = await CityService(State.COD_STATE)
          if (Array.isArray(citiesResponse)) {
            set_ApiCities(citiesResponse)
          } else {
            toast.error('No hay ciudades disponibles')
            set_ApiCities([])
          }
        } catch (error) {
          toast.error('Error al obtener ciudades')
          set_ApiCities([])
        } finally {
          setLoadingCity(false)
        }
      }
      fetchCities()
    }
  }, [State])

  const handleCountryChange = (e) => {
    const countryCode = e.target.value
    const selectedCountry = ApiCountry.find((country) => country.COD_COUNTRY === countryCode)
    set_pais(countryCode)
    set_Datoslocalizacion({
      ...Datoslocalizacion,
      pais: countryCode,
      paisNombre: selectedCountry ? selectedCountry.DES_COUNTRY : '',
    })
    set_state(null)
    set_ApiCities([])
  }

  const handleStateChange = async (stateCode) => {
    const selectedState = ApiState.find((state) => state.COD_STATE === stateCode)
    set_state(selectedState)
    set_Datoslocalizacion({
      ...Datoslocalizacion,
      departamento: stateCode,
      departamentoNombre: selectedState ? selectedState.DES_STATE : '',
    })
    set_ApiCities([])

    if (stateCode) {
      try {
        setLoadingCity(true)
        const citiesResponse = await CityService(stateCode)
        if (Array.isArray(citiesResponse)) {
          set_ApiCities(citiesResponse)
        } else {
          toast.error('Cities no es un array o está vacío')
          set_ApiCities([])
        }
      } catch (error) {
        toast.error('Error al obtener ciudades:', error)
        set_ApiCities([])
      } finally {
        setLoadingCity(false)
      }
    }
  }

  const handleCityChange = (e) => {
    const cityCode = e.target.value
    const selectedCity = ApiCities.find((city) => city.COD_CITY === cityCode)
    set_Datoslocalizacion({
      ...Datoslocalizacion,
      ciudad: cityCode,
      ciudadNombre: selectedCity ? selectedCity.DES_CITY : '',
    })
  }

  return (
    <>
      <CInputGroup className="mb-3">
        <CInputGroupText>
          <CIcon icon={cilGlobeAlt} />
        </CInputGroupText>
        <CFormSelect
          onChange={(e) => {
            const selectedArea = e.target.options[e.target.selectedIndex].text
            set_Datoslocalizacion({
              ...Datoslocalizacion,
              AREA_COUNTRY: selectedArea,
            })
          }}
          value={Datoslocalizacion.AREA_COUNTRY || ''}
        >
          <option value="">-- Seleccione un área --</option>
          {loadingCountry ? (
            <option disabled>Cargando áreas...</option>
          ) : (
            <SelectArea ApiCountry={ApiCountry} />
          )}
        </CFormSelect>
      </CInputGroup>

      <CInputGroup className="mb-3">
        <CInputGroupText>
          <CIcon icon={cilPhone} />
        </CInputGroupText>
        <InputMask
          mask="9999-9999"
          value={telefono}
          onChange={(e) => {
            setTelefono(e.target.value)
            set_Datoslocalizacion({
              ...Datoslocalizacion,
              telefono: e.target.value,
            })
          }}
          className="form-control"
          placeholder="Número telefónico"
        />
      </CInputGroup>

      <CInputGroup className="mb-3">
        <CInputGroupText>
          <CIcon icon={cilGlobeAlt} />
        </CInputGroupText>
        <CFormSelect
          onChange={handleCountryChange}
          value={Datoslocalizacion.pais || ''}
          disabled={!Datoslocalizacion.AREA_COUNTRY}
        >
          <option value="">-- Seleccione un país --</option>
          {loadingCountry ? (
            <option disabled>Cargando países...</option>
          ) : (
            <SelectCountry ApiCountry={ApiCountry} />
          )}
        </CFormSelect>
      </CInputGroup>

      <CInputGroup className="mb-3">
        <CInputGroupText>
          <CIcon icon={cilGlobeAlt} />
        </CInputGroupText>
        <CFormSelect
          onChange={(e) => handleStateChange(e.target.value)}
          value={Datoslocalizacion.departamento || ''}
          disabled={!Datoslocalizacion.pais}
        >
          <option value="">-- Seleccione un departamento --</option>
          {loadingState ? (
            <option disabled>Cargando departamentos...</option>
          ) : (
            <SelectState ApiState={ApiState} />
          )}
        </CFormSelect>
      </CInputGroup>

      <CInputGroup className="mb-4">
        <CInputGroupText>
          <CIcon icon={cilGlobeAlt} />
        </CInputGroupText>
        <CFormSelect
          onChange={handleCityChange}
          value={Datoslocalizacion.ciudad || ''}
          disabled={!Datoslocalizacion.departamento}
        >
          <option value="">-- Seleccione una ciudad --</option>
          {loadingCity ? (
            <option disabled>Cargando ciudades...</option>
          ) : (
            <SelectCity ApiCities={ApiCities} />
          )}
        </CFormSelect>
      </CInputGroup>

      <CInputGroup className="mb-3">
        <CInputGroupText>
          <CIcon icon={cilLocationPin} />
        </CInputGroupText>
        <textarea
          className="form-control"
          placeholder="Dirección"
          value={Datoslocalizacion.DES_COUNTRY || ''}
          onChange={(e) => {
            const value = e.target.value
            if (/^[a-zA-Z0-9\s]*$/.test(value) && value.length <= 250) {
              set_Datoslocalizacion({
                ...Datoslocalizacion,
                DES_COUNTRY: value,
              })
            }
          }}
          disabled={!Datoslocalizacion.ciudad}
        />
      </CInputGroup>
    </>
  )
}

DirectionInformation.propTypes = {
  Datoslocalizacion: PropTypes.shape({
    AREA_COUNTRY: PropTypes.string,
    telefono: PropTypes.string,
    DES_COUNTRY: PropTypes.string,
    pais: PropTypes.string,
    paisNombre: PropTypes.string,
    departamento: PropTypes.string,
    departamentoNombre: PropTypes.string,
    ciudad: PropTypes.string,
    ciudadNombre: PropTypes.string,
  }).isRequired,
  set_Datoslocalizacion: PropTypes.func.isRequired,
}

export default DirectionInformation
