import { DataTypes } from 'sequelize';
import sequelize from '../config/database/index.js';  // Importar la instancia de Sequelize

// Definir el modelo SE_OBJETOS
const SeObjetos = sequelize.define('SeObjetos', {
  COD_OBJETO: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  NOM_OBJETO: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  DES_OBJETO: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  ESTADO: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'SE_OBJETOS',
  timestamps: false,  // Deshabilitar timestamps automáticos (createdAt, updatedAt)
});

export default SeObjetos;
