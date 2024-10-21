import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader, CCardText } from '@coreui/react'

const LockerCard = ({ locker, selectedLocker, setSelectedLocker }) => {
  const navigate = useNavigate()
  const isSelected = selectedLocker?.COD_LOCKER === locker.COD_LOCKER
  const fullName =
    `${locker.COD_VIRTUAL_LOCKER_CODE} ${locker.FIRSTNAME} ${locker.MIDDLENAME || ''} ${locker.LASTNAME}`.trim()

  const handleCardClick = () => {
    if (setSelectedLocker) {
      setSelectedLocker(locker)
    }
    if (locker.DESCRIPCION.toLowerCase().includes('express')) {
      navigate('/casillero_express')
    } else {
      navigate('/casillero_normal')
    }
  }

  return (
    <CCard
      className={`mb-4 ${isSelected ? 'border border-primary' : ''}`}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <CCardHeader className="bg-light text-dark text-center">
        <strong>{locker.DESCRIPCION}</strong>
      </CCardHeader>
      <CCardBody>
        <CCardText>
          <strong>NOMBRE:</strong> {fullName}
        </CCardText>
        <CCardText>
          <strong>PAÍS:</strong> {locker.PAIS}
        </CCardText>
        <CCardText>
          <strong>ESTADO:</strong> {locker.ESTADO}
        </CCardText>
        <CCardText>
          <strong>CIUDAD:</strong> {locker.CIUDAD}
        </CCardText>
        <CCardText>
          <strong>LINEA 1:</strong> {locker.LINEA_1}
        </CCardText>
        <CCardText>
          <strong>LINEA 2:</strong> {locker.LINEA_2}
        </CCardText>
        <CCardText>
          <strong>CÓDIGO POSTAL:</strong> {locker.CODIGO_POSTAL}
        </CCardText>
        <CCardText>
          <strong>TELEFONO:</strong> (+1) {locker.TELEFONO}
        </CCardText>
        <CCardText className="text-success text-center">
          <strong>Precio: ${locker.PRECIO.toFixed(2)}</strong>
        </CCardText>
      </CCardBody>
    </CCard>
  )
}

LockerCard.propTypes = {
  locker: PropTypes.shape({
    COD_LOCKER: PropTypes.number.isRequired,
    DESCRIPCION: PropTypes.string.isRequired,
    PAIS: PropTypes.string.isRequired,
    ESTADO: PropTypes.string.isRequired,
    CIUDAD: PropTypes.string.isRequired,
    LINEA_1: PropTypes.string.isRequired,
    LINEA_2: PropTypes.string,
    CODIGO_POSTAL: PropTypes.string.isRequired,
    TELEFONO: PropTypes.string.isRequired,
    PRECIO: PropTypes.number.isRequired,
    COD_VIRTUAL_LOCKER_CODE: PropTypes.string.isRequired,
    FIRSTNAME: PropTypes.string.isRequired,
    MIDDLENAME: PropTypes.string,
    LASTNAME: PropTypes.string.isRequired,
  }).isRequired,
  selectedLocker: PropTypes.object,
  setSelectedLocker: PropTypes.func,
}

export default LockerCard
