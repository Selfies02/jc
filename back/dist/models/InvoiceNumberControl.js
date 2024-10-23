import { DataTypes } from 'sequelize';
import sequelize from '../config/database/index.js'; // Importar la instancia de Sequelize

const InvoiceNumberControl = sequelize.define('InvoiceNumberControl', {
  COD_INVOICE_NUMBER: {
    type: DataTypes.TINYINT,
    // Cambiado a BIGINT si esperas valores mayores
    primaryKey: true,
    allowNull: false
  },
  LAST_NUMBER: {
    type: DataTypes.BIGINT,
    allowNull: false
  }
}, {
  tableName: 'INVOICE_NUMBER_CONTROL',
  timestamps: false // Asegura que Sequelize no gestione timestamps automáticos
});
export default InvoiceNumberControl;