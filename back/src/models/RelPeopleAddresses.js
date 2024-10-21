import { DataTypes } from 'sequelize';
import sequelize from '../config/database/index.js';  // Importar la instancia de Sequelize

// Definir el modelo REL_PEOPLE_ADDRESSES
const RelPeopleAddresses = sequelize.define('RelPeopleAddresses', {
  COD_REL_PEOADDRES: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  COD_ADDRESS: {
    type: DataTypes.BIGINT,
  },
  COD_PEOPLE: {
    type: DataTypes.BIGINT,
  },
  DAT_ADD: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,  // Fecha de creación por defecto
  },
}, {
  tableName: 'REL_PEOPLE_ADDRESSES',
  timestamps: false,  // Deshabilitar timestamps automáticos
});

export default RelPeopleAddresses;
