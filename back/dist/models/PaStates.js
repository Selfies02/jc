import { DataTypes } from 'sequelize';
import sequelize from '../config/database/index.js'; // Importar la instancia de Sequelize

// Definir el modelo PA_STATES
const PaStates = sequelize.define('PaStates', {
  COD_STATE: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  COD_COUNTRY: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  NAM_STATE: {
    type: DataTypes.STRING(100)
  },
  DES_STATE: {
    type: DataTypes.STRING(1000)
  },
  IND_STATE: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1
  },
  AREA_STATE: {
    type: DataTypes.STRING(40)
  },
  USR_ADD: {
    type: DataTypes.STRING(30)
  },
  DAT_ADD: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW // Asignar la fecha actual por defecto
  },
  USR_UPD: {
    type: DataTypes.STRING(30)
  },
  DAT_UPD: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'PA_STATES',
  timestamps: false // Deshabilitar timestamps automáticos
});
export default PaStates;