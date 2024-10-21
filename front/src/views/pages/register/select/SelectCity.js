import React from 'react'
import PropTypes from 'prop-types'

export const SelectCity = ({ ApiCities }) => {
  // Verifica si ApiCities está definido y es un array
  const cities = Array.isArray(ApiCities) ? ApiCities : []

  return (
    <>
      {cities.length === 0 ? (
        <option value="">-- No hay ciudades disponibles --</option>
      ) : (
        cities.map((city) => (
          <option key={city.COD_CITY} value={city.COD_CITY}>
            {city.NAM_CITY}
          </option>
        ))
      )}
    </>
  )
}

SelectCity.propTypes = {
  ApiCities: PropTypes.arrayOf(
    PropTypes.shape({
      COD_CITY: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      NAM_CITY: PropTypes.string.isRequired,
    }),
  ).isRequired,
}
