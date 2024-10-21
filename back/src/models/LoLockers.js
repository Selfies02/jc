import { DataTypes } from 'sequelize';
import sequelize from '../config/database/index.js';  // Importar la instancia de Sequelize

// Definir el modelo LO_LOCKERS
const LoLockers = sequelize.define('LoLockers', {
  COD_LOCKER: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  DESCRIPCION: {
    type: DataTypes.STRING(255),
  },
  TIPO: {
    type: DataTypes.ENUM('EXPRESS', 'NORMAL'),
  },
  LINEA_1: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  LINEA_2: {
    type: DataTypes.STRING(255),
  },
  CIUDAD: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  ESTADO: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  CODIGO_POSTAL: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  TELEFONO: {
    type: DataTypes.STRING(20),
  },
  PAIS: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  PRECIO: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
  },
  USR_ADD: {
    type: DataTypes.STRING(30),  // Corregido para representar un nombre de usuario
    allowNull: false,
  },
  DAT_ADD: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  USR_UPD: {
    type: DataTypes.STRING(30),  // Corregido para representar un nombre de usuario
  },
  DAT_UPD: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'LO_LOCKERS',
  timestamps: false,  // Deshabilitar timestamps automáticos
});

export default LoLockers;
