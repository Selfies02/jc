import React from 'react'
import PropTypes from 'prop-types'

export const SelectCountry = ({ ApiCountry }) => {
  return (
    <>
      {ApiCountry.map((item) => (
        <option key={item.COD_COUNTRY} value={item.COD_COUNTRY}>
          {item.NAM_COUNTRY}
        </option>
      ))}
    </>
  )
}

SelectCountry.propTypes = {
  ApiCountry: PropTypes.arrayOf(
    PropTypes.shape({
      COD_COUNTRY: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      NAM_COUNTRY: PropTypes.string,
    }),
  ).isRequired,
}
