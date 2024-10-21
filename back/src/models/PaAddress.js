import { DataTypes } from 'sequelize';
import sequelize from '../config/database/index.js';  // Importar la instancia de Sequelize

// Definir el modelo PA_ADDRESS
const PaAddress = sequelize.define('PaAddress', {
  COD_ADDRESS: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  COD_COUNTRY: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  COD_STATE: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  COD_CITY: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  DES_ADDRESS: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  USR_ADD: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  DAT_ADD: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,  // Asignar la fecha actual por defecto
  },
  USR_UPD: {
    type: DataTypes.STRING(30),
  },
  DAT_UPD: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'PA_ADDRESS',
  timestamps: false,  // Deshabilitar timestamps automáticos
});

export default PaAddress;
