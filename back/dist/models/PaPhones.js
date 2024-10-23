import { DataTypes } from 'sequelize';
import sequelize from '../config/database/index.js'; // Importar la instancia de Sequelize

// Definir el modelo PA_PHONES
const PaPhones = sequelize.define('PaPhones', {
  COD_PHONE: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  COD_PEOPLE: {
    type: DataTypes.BIGINT
  },
  NUM_AREA: {
    type: DataTypes.STRING(60)
  },
  NUM_PHONE: {
    type: DataTypes.STRING(15)
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
  tableName: 'PA_PHONES',
  timestamps: false // Deshabilitar timestamps automáticos
});
export default PaPhones;