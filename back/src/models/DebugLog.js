import { DataTypes } from 'sequelize';
import sequelize from '../config/database/index.js'; // Importa la instancia correcta de Sequelize

const DebugLog = sequelize.define('DebugLog', {
  COD_LOG: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  MESSAGE: {
    type: DataTypes.STRING(1000),
    allowNull: false, // Hacer que el mensaje sea obligatorio
  },
  SEVERITY: {
    type: DataTypes.STRING(50),
    allowNull: false, // Hacer que la severidad sea obligatoria
  },
  ERROR_CODE: {
    type: DataTypes.BIGINT, // Cambiado a BIGINT si esperas códigos de error grandes
  },
  DAT_ADD: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false, // Asegurarse de que la fecha de adición no sea nula
  },
}, {
  tableName: 'DEBUG_LOG',
  timestamps: false,
});

export default DebugLog;
