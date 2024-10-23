import { DataTypes } from 'sequelize';
import sequelize from '../config/database/index.js'; // Importar la instancia de Sequelize

// Definir el modelo LO_PRECIOS
const LoPrecios = sequelize.define('LoPrecios', {
  COD_PRECIO: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  PRECIO: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  DES_PRECIO: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  USR_ADD: {
    type: DataTypes.STRING(30),
    // Usuario que agrega el registro
    allowNull: false
  },
  DAT_ADD: {
    type: DataTypes.DATE,
    allowNull: false
  },
  USR_UPD: {
    type: DataTypes.STRING(30) // Usuario que actualiza el registro
  },
  DAT_UPD: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'LO_PRECIOS',
  timestamps: false // Deshabilitar timestamps automáticos
});
export default LoPrecios;