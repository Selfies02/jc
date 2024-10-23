import { DataTypes } from 'sequelize';
import sequelize from '../config/database/index.js'; // Instancia de Sequelize

// Definir el modelo SE_USERS
const SeUsers = sequelize.define('SeUsers', {
  COD_USER: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  COD_PEOPLE: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  COD_ROL: {
    type: DataTypes.BIGINT
  },
  PROFILE_PHOTO_PATH: {
    type: DataTypes.STRING(250)
  },
  EMAIL: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  EMAIL_VERIFIED: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    allowNull: false
  },
  PAS_USER: {
    type: DataTypes.STRING(120),
    allowNull: false
  },
  API_TOKEN: {
    type: DataTypes.STRING(255)
  },
  IND_USR: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    allowNull: false
  },
  IND_INS: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    allowNull: false
  },
  USR_ADD: {
    type: DataTypes.STRING(30)
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
  tableName: 'SE_USERS',
  timestamps: false // Deshabilitar timestamps automáticos de Sequelize
});
export default SeUsers;