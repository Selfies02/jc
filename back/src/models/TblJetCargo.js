import { DataTypes } from 'sequelize';
import sequelize from '../config/database/index.js';

const TblJetCargo = sequelize.define('TblJerCargo', {
    NOMBRE: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    RTN: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    EMAIL: {
      type: DataTypes.STRING(80 ),
      allowNull: false,
    },
    TELEFONO: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    DIRECCION: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    IMAGEN: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  }, {
    tableName: 'TBL_JETCARGO',
    timestamps: false,
  });
  
  export default TblJetCargo;