import { DataTypes } from 'sequelize';
import sequelize from '../config/database/index.js';

const PaPeople = sequelize.define('PaPeople', {
  COD_PEOPLE: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  ID: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  TIP_DOCUMENT: {
    type: DataTypes.ENUM('ID', 'PASAPORTE', 'LICENCIA'),
    allowNull: false,
  },
  FIRSTNAME: {
    type: DataTypes.STRING(120),
    allowNull: false,
  },
  MIDDLENAME: {
    type: DataTypes.STRING(120),
  },
  LASTNAME: {
    type: DataTypes.STRING(120),
    allowNull: false,
  },
  AGE: {
    type: DataTypes.STRING(3),
    allowNull: false,
  },
  DAT_BIRTH: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  TIP_PERSONA: {
    type: DataTypes.ENUM('N', 'J'),
  },
  IND_PEOPLE: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    allowNull: false,
  },
  USR_ADD: {
    type: DataTypes.STRING(30),
  },
  DAT_ADD: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  USR_UPD: {
    type: DataTypes.STRING(30),
  },
  DAT_UPD: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'PA_PEOPLE',
  timestamps: false,
});

export default PaPeople;