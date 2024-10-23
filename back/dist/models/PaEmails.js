import { DataTypes } from 'sequelize';
import sequelize from '../config/database/index.js';
const PaEmails = sequelize.define('PaEmails', {
  COD_EMAIL: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  COD_PEOPLE: {
    type: DataTypes.BIGINT
  },
  EMAIL: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  TYP_EMAIL: {
    type: DataTypes.ENUM('P', 'O')
  },
  USR_ADD: {
    type: DataTypes.STRING(30)
  },
  DAT_ADD: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  USR_UPD: {
    type: DataTypes.STRING(30)
  },
  DAT_UPD: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'PA_EMAILS',
  timestamps: false
});
export default PaEmails;