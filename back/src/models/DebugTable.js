import { DataTypes } from 'sequelize';
import sequelize from '../config/database/index.js';  // Importar la instancia de Sequelize

const DebugTable = sequelize.define('DebugTable', {
  COD_TABLE: {
    type: DataTypes.BIGINT,  // Cambiado a BIGINT si esperas valores mayores
    primaryKey: true,
    autoIncrement: true,
  },
  MESSAGE: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
}, {
  tableName: 'DEBUG_TABLE',
  timestamps: false,  // Asegura que Sequelize no gestione timestamps automáticos
});

export default DebugTable;
