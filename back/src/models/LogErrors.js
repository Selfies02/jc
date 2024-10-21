import { DataTypes } from 'sequelize';
import sequelize from '../config/database/index.js';  // Instancia de Sequelize

const LogErrors = sequelize.define('LogErrors', {
  COD_ERROR: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  DES_ERROR: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  HTTP_ERROR: {
    type: DataTypes.STRING(255),  // Tamaño adecuado para mensajes de error HTTP
    allowNull: false,
  },
  STATUS_ERROR: {
    type: DataTypes.STRING(255),  // Usar STRING en lugar de TEXT para este campo
    allowNull: false,
  },
  DAT_ADD: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,  // Asignar la fecha actual por defecto
  },
}, {
  tableName: 'LOG_ERRORS',
  timestamps: false,  // Deshabilitar timestamps automáticos
});

export default LogErrors;
