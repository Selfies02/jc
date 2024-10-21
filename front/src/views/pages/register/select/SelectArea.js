import React from 'react'
import PropTypes from 'prop-types'

export const SelectArea = ({ ApiCountry }) => {
  // Verifica si ApiCountry es un array válido
  if (!ApiCountry || !ApiCountry.length) {
    return <option disabled>No hay áreas disponibles</option>
  }

  // Mapea los datos de ApiCountry a opciones
  return (
    <>
      {ApiCountry.map((country, index) => (
        <option key={`${country.AREA_COUNTRY}-${index}`} value={country.AREA_COUNTRY}>
          {country.AREA_COUNTRY}
        </option>
      ))}
    </>
  )
}

SelectArea.propTypes = {
  ApiCountry: PropTypes.arrayOf(
    PropTypes.shape({
      AREA_COUNTRY: PropTypes.string,
    }),
  ).isRequired,
}
