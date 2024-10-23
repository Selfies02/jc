import { DataTypes } from 'sequelize';
import sequelize from '../config/database/index.js'; // Importar la instancia de Sequelize

// Definir el modelo LO_TRANSIT_PACKAGES
const LoTransitPackages = sequelize.define('LoTransitPackages', {
  COD_PAQUETETRANSITO: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  COD_CUSTOMER: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  COD_ORDEN: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  COD_LOCKER: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  TRACKING: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  IMAGEN: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  ESTADO: {
    type: DataTypes.ENUM('EN BODEGA', 'EN TRANSITO', 'LISTO PARA RETIRAR', 'ENTREGADO'),
    allowNull: true
  },
  INS_CHARGE: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  DAT_ADD: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW // Asignar la fecha actual por defecto
  },
  DAT_UPD: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'LO_TRANSIT_PACKAGES',
  timestamps: false // Deshabilitar timestamps automáticos
});
export default LoTransitPackages;