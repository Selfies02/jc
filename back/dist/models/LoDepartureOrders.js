import { DataTypes } from 'sequelize';
import sequelize from '../config/database/index.js'; // Importar la instancia de Sequelize

// Definir el modelo LO_DEPARTURE_ORDERS
const LoDepartureOrders = sequelize.define('LoDepartureOrders', {
  COD_ORDEN_SALIDA: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  NUM_ORDEN_SALIDA: {
    type: DataTypes.STRING(255) // Cambio a STRING para un nombre
  },
  DESCRIPCION: {
    type: DataTypes.STRING(255)
  },
  DAT_ADD: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW // Asignar la fecha actual por defecto
  }
}, {
  tableName: 'LO_DEPARTURE_ORDERS',
  timestamps: false // Deshabilitar timestamps automáticos
});
export default LoDepartureOrders;