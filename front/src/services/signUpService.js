import api from '../utils/Fetch.js'

export const SignUp = async (email, password, personalInfo, addressInfo) => {
  try {
    const userData = {
      p_EMAIL: email,
      p_PAS_USER: password,
      p_ID: personalInfo.identificacion,
      p_TIP_DOCUMENT: personalInfo.tipodocumento,
      p_FIRSTNAME: personalInfo.nombre,
      p_MIDDLENAME: personalInfo.segundoNombre || '',
      p_LASTNAME: personalInfo.apellido,
      p_DAT_BIRTH: personalInfo.fechaNacimiento,
      p_AGE: personalInfo.añoNacimiento,
      p_NUM_PHONE: addressInfo.telefono,
      p_NUM_AREA: addressInfo.AREA_COUNTRY,
      p_COD_COUNTRY: addressInfo.pais,
      p_COD_STATE: addressInfo.departamento,
      p_COD_CITY: addressInfo.ciudad,
      p_DES_ADDRESS: addressInfo.DES_COUNTRY,
      p_COD_ROL: 2,
      p_USR_ADD: 'AUTO REGISTRO',
    }

    const response = await api.post('/signup', userData)

    return response.data
  } catch (error) {
    const errorMessage = error.response?.data?.message
    throw new Error(errorMessage)
  }
}
