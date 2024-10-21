import { DataTypes } from 'sequelize';
import sequelize from '../config/database/index.js';  // Importar la instancia de Sequelize

const SeRoles = sequelize.define('SeRoles', {
  COD_ROL: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  NOM_ROL: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  DES_ROL: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  USR_ADD: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  DAT_ADD: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, // Asignar la fecha actual por defecto
  },
  USR_UPD: {
    type: DataTypes.STRING(30),
  },
  DAT_UPD: {
    type: DataTypes.DATE,
  },
  ESTADO: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
}, {
  tableName: 'SE_ROLES',
  timestamps: false,  // Deshabilitar timestamps automáticos
});

export default SeRoles;
