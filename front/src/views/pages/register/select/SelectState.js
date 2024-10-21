import React from 'react'
import PropTypes from 'prop-types'

export const SelectState = ({ ApiState }) => {
  return (
    <>
      {ApiState.map((state) => (
        <option key={state.COD_STATE} value={state.COD_STATE}>
          {state.NAM_STATE}
        </option>
      ))}
    </>
  )
}

SelectState.propTypes = {
  ApiState: PropTypes.arrayOf(
    PropTypes.shape({
      COD_STATE: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      NAM_STATE: PropTypes.string,
    }),
  ).isRequired,
}
