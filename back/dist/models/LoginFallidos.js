import { DataTypes } from 'sequelize';
import sequelize from '../config/database/index.js'; // Importar la instancia de Sequelize

// Definir el modelo LOGIN_FALLIDOS
const LoginFallidos = sequelize.define('LoginFallidos', {
  COD_LOGINFALLIDOS: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  COD_USER: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  COUNT_ERROR: {
    type: DataTypes.INTEGER,
    // Cambiado a INTEGER para contar intentos
    allowNull: false
  },
  DAT_ADD: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW // Asignar la fecha actual por defecto
  }
}, {
  tableName: 'LOGIN_FALLIDOS',
  timestamps: false // Deshabilitar timestamps automáticos
});
export default LoginFallidos;