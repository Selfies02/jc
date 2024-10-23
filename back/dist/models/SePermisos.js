import { DataTypes } from 'sequelize';
import sequelize from '../config/database/index.js'; // Instancia de Sequelize

// Definir el modelo SE_PERMISOS
const SePermisos = sequelize.define('SePermisos', {
  COD_PERMISO: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  COD_ROL: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  COD_OBJETO: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  DES_PERMISO_INSERCCION: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  DES_PERMISO_ELIMINACION: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  DES_PERMISO_ACTUALIZACION: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  DES_PERMISO_CONSULTAR: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  PERMISO_REPORTE: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  ESTADO: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
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
  tableName: 'SE_PERMISOS',
  timestamps: false // Deshabilitar timestamps automáticos (createdAt, updatedAt)
});
export default SePermisos;