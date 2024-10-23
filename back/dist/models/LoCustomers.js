import { DataTypes } from 'sequelize';
import sequelize from '../config/database/index.js'; // Importar la instancia de Sequelize

// Definir el modelo PA_CUSTOMERS
const PaCustomers = sequelize.define('PaCustomers', {
  COD_CUSTOMER: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  COD_USER: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  IND_TYPCUST: {
    type: DataTypes.ENUM('N', 'E'),
    allowNull: false,
    defaultValue: 'N'
  },
  USR_ADD: {
    type: DataTypes.STRING(30),
    allowNull: false
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
  tableName: 'PA_CUSTOMERS',
  timestamps: false // Deshabilitar timestamps automáticos
});
export default PaCustomers;