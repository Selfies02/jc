import React, { createContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

// Crear el contexto
export const AuthContext = createContext()

// Crear el proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // Para manejar la carga inicial

  // Función para iniciar sesión y almacenar el estado
  const login = (userData) => {
    setIsAuthenticated(true)
    setUser(userData) // Asegúrate de que userData incluye customerId
    localStorage.setItem('Jet-Cargo_user_data', JSON.stringify(userData)) // Almacenar los datos del usuario
    setLoading(false)
  }

  // Función para cerrar sesión
  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.clear() // Limpiar los tokens y datos
    window.location.href = '/login' // Redirigir al login
  }

  // Verificar si el usuario ya está autenticado al cargar la app
  useEffect(() => {
    const token = localStorage.getItem('Jet-Cargo_jwt_login')
    const userData = localStorage.getItem('Jet-Cargo_user_data')

    if (token && userData) {
      const parsedUserData = JSON.parse(userData)

      // No se realiza ninguna acción si customerId no está presente
      setIsAuthenticated(true)
      setUser(parsedUserData) // Restaurar los datos del usuario
    }

    setLoading(false) // Finalizamos la carga
  }, [])

  if (loading) {
    return <div>Cargando...</div> // Mostrar algo mientras se verifica el estado
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Validar que children es requerido
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AuthProvider
