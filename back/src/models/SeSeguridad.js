import { DataTypes } from 'sequelize';
import sequelize from '../config/database/index.js';  // Importa la instancia de Sequelize desde el archivo de configuración

// Definir el modelo SE_SEGURIDAD
const SeSeguridad = sequelize.define('SeSeguridad', {
  COD_SEGURIDAD: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  NAM_SEGURIDAD: {
    type: DataTypes.STRING(120),
    allowNull: false,
  },
  DATO_SEGURIDAD: {
    type: DataTypes.STRING(120),
    allowNull: false,
  },
  DES_SEGURIDAD: {
    type: DataTypes.STRING(120),
    allowNull: false,
  },
}, {
  tableName: 'SE_SEGURIDAD',
  timestamps: false,  // Deshabilita los campos automáticos de timestamps (createdAt, updatedAt)
});

export default SeSeguridad;
