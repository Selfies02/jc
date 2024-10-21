import { DataTypes } from 'sequelize';
import sequelize from '../config/database/index.js';  // Importar la instancia de Sequelize

// Definir el modelo SE_PASSRESETS
const SePassResets = sequelize.define('SePassResets', {
  EMAIL: {
    type: DataTypes.STRING(120),
    primaryKey: true,
    allowNull: false,
  },
  API_TOKEN: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  DAT_ADD: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,  // Asignar fecha y hora actuales por defecto
  },
}, {
  tableName: 'SE_PASSRESETS',
  timestamps: false,  // Deshabilitar timestamps automáticos
});

export default SePassResets;
