import { DataTypes } from 'sequelize';
import sequelize from '../config/database/index.js'; // Importar la instancia de Sequelize

// Definir el modelo PAY_INVOICES
const PayInvoices = sequelize.define('PayInvoices', {
  COD_INVOICE: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  NUM_INVOICE: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  TOT_GENERAL: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  IND_INVOICE: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1
  },
  RUTA: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  USR_ADD: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  DAT_ADD: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW // Asignar la fecha actual por defecto
  }
}, {
  tableName: 'PAY_INVOICES',
  timestamps: false // Deshabilitar timestamps automáticos
});
export default PayInvoices;