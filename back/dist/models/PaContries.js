import { DataTypes } from 'sequelize';
import sequelize from '../config/database/index.js'; // Importar la instancia de Sequelize

// Definir el modelo PA_COUNTRIES
const PaCountries = sequelize.define('PaCountries', {
  COD_COUNTRY: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  NAM_COUNTRY: {
    type: DataTypes.STRING(80)
  },
  IND_COUNTRY: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1
  },
  DES_COUNTRY: {
    type: DataTypes.STRING(1000)
  },
  AREA_COUNTRY: {
    type: DataTypes.STRING(40)
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
  tableName: 'PA_COUNTRIES',
  timestamps: false // Deshabilitar timestamps automáticos
});
export default PaCountries;