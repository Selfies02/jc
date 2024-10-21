import sequelize from '../config/database/index.js';

export const getAllPrecios = async (req, res) => {
  try {
    const results = await sequelize.query('CALL GET_ALL_PRECIOS();');
    
    return res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Error al obtener los precios:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los precios',
      error: error.message,
    });
  }
};

export const updatePrecio = async (req, res) => {
    const { p_cod_precio, p_precio, p_usr_upd } = req.body;
  
    try {
      const result = await sequelize.query(
        `CALL UPD_PRECIO(:p_cod_precio, :p_precio, :p_usr_upd);`,
        {
          replacements: { 
            p_cod_precio,
            p_precio,
            p_usr_upd
          },
          type: sequelize.QueryTypes.RAW
        }
      );
  
      res.status(200).json({
        message: 'Precio actualizado correctamente',
        result
      });
  
    } catch (error) {
      console.error('Error actualizando el precio:', error);
  
      if (error.original && error.original.sqlMessage) {
        return res.status(500).json({
          message: error.original.sqlMessage
        });
      }
  
      res.status(500).json({
        message: 'Error al actualizar el precio'
      });
    }
  };