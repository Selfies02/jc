import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'
import { AuthContext } from './actions/authContext'

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext)

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return children
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

export default PrivateRoute