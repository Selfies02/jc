import * as yup from 'yup'

// Validaciones existentes
export const Register_email = yup.object().shape({
  email: yup
    .string()
    .email('Ingrese un correo electrónico válido')
    .required('El correo electrónico es necesario')
    .min(5, 'El correo electrónico debe tener al menos 5 caracteres')
    .max(30, 'El correo electrónico no puede exceder los 30 caracteres'),
})

// Nuevas validaciones para facturación
export const BillingValidations = yup.object().shape({
  rtn: yup
    .string()
    .matches(/^\d+$/, 'El RTN solo puede contener números')
    .max(15, 'El RTN no puede tener más de 15 dígitos'),

  dollarExchangeRate: yup
    .number()
    .typeError('El cambio del dólar debe ser un número')
    .positive('El cambio del dólar debe ser positivo')
    .test(
      'is-decimal',
      'El cambio del dólar debe tener máximo 8 enteros y 2 decimales',
      (value) => {
        if (value != null) {
          const parts = value.toString().split('.')
          return parts[0].length <= 8 && (!parts[1] || parts[1].length <= 2)
        }
        return true
      },
    )
    .required('El cambio del dólar es requerido'),

  pricePerPound: yup
    .number()
    .typeError('El precio por libra debe ser un número')
    .positive('El precio por libra debe ser positivo')
    .test(
      'is-decimal',
      'El precio por libra debe tener máximo 8 enteros y 2 decimales',
      (value) => {
        if (value != null) {
          const parts = value.toString().split('.')
          return parts[0].length <= 8 && (!parts[1] || parts[1].length <= 2)
        }
        return true
      },
    )
    .required('El precio por libra es requerido'),

  volumetricWeight: yup
    .number()
    .typeError('El peso volumétrico debe ser un número')
    .positive('El peso volumétrico debe ser positivo')
    .test(
      'is-decimal',
      'El peso volumétrico debe tener máximo 8 enteros y 2 decimales',
      (value) => {
        if (value != null) {
          const parts = value.toString().split('.')
          return parts[0].length <= 8 && (!parts[1] || parts[1].length <= 2)
        }
        return true
      },
    )
    .required('El peso volumétrico es requerido'),

  realWeight: yup
    .number()
    .typeError('El peso real debe ser un número')
    .positive('El peso real debe ser positivo')
    .test('is-decimal', 'El peso real debe tener máximo 8 enteros y 2 decimales', (value) => {
      if (value != null) {
        const parts = value.toString().split('.')
        return parts[0].length <= 8 && (!parts[1] || parts[1].length <= 2)
      }
      return true
    })
    .required('El peso real es requerido'),
})
