import { DataTypes } from 'sequelize';
import sequelize from '../config/database/index.js'; // Importar la instancia de Sequelize

// Definir el modelo PA_CITIES
const PaCities = sequelize.define('PaCities', {
  COD_CITY: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  COD_STATE: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  NAM_CITY: {
    type: DataTypes.STRING(100)
  },
  ZIP_CODE: {
    type: DataTypes.INTEGER
  },
  POS_CODE: {
    type: DataTypes.INTEGER
  },
  POPULATION: {
    type: DataTypes.STRING(120)
  },
  CURRENCY: {
    type: DataTypes.STRING(20)
  },
  IND_CITY: {
    type: DataTypes.TINYINT,
    defaultValue: 1
  },
  TIMEZONE: {
    type: DataTypes.STRING(20)
  },
  LATITUDE: {
    type: DataTypes.STRING(20)
  },
  LONGITUDE: {
    type: DataTypes.STRING(20)
  },
  DES_CITY: {
    type: DataTypes.STRING(2000)
  },
  USR_ADD: {
    type: DataTypes.STRING(30)
  },
  DAT_ADD: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW // Asignar la fecha actual por defecto
  },
  USR_UPD: {
    type: DataTypes.STRING(30)
  },
  DAT_UPD: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'PA_CITIES',
  timestamps: false // Deshabilitar timestamps automáticos
});
export default PaCities;