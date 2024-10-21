import { DataTypes } from 'sequelize';
import sequelize from '../config/database/index.js';  // Importar la instancia de Sequelize

// Definir el modelo REL_CLIENTES_LOCKERS
const RelClientesLockers = sequelize.define('RelClientesLockers', {
  COD_REL_CLIENTE_LOCKER: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  COD_CUSTOMER: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  COD_LOCKER: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  COD_VIRTUAL_LOCKER_CODE: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  DAT_ADD: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,  // Fecha de creación por defecto
  },
}, {
  tableName: 'REL_CLIENTES_LOCKERS',
  timestamps: false,  // Deshabilitar timestamps automáticos
});

export default RelClientesLockers;
