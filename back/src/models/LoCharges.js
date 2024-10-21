import { DataTypes } from 'sequelize';
import sequelize from '../config/database/index.js';  // Importar la instancia de Sequelize

// Definir el modelo LO_CHARGES
const LoCharges = sequelize.define('LoCharges', {
  COD_COBRO: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  COD_PAQUETETRANSITO: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  COD_INVOICE: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  PESO_VOLUMEN: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  PESO_REAL: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  PRECIO: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  ISV: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  SUBTOTAL: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  TOTAL: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  DELIVERY: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: 0,
  },
  PAYMENTMETHOD: {
    type: DataTypes.ENUM('EFECTIVO', 'TRANSFERENCIA'),
    allowNull: false,
  },
  DAT_ADD: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,  // Asignar la fecha actual por defecto
  },
  DAT_UPD: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,  // Asignar fecha de actualización por defecto
  },
}, {
  tableName: 'LO_CHARGES',
  timestamps: false,  // Deshabilitar timestamps automáticos
});

export default LoCharges;
