import sequelize from '../config/database/index.js';
export const getAllCustomersWithLockers = async (req, res) => {
  try {
    const results = await sequelize.query('CALL GET_CUSTOMERS();', {
      type: sequelize.QueryTypes.RAW
    });
    if (!results || results.length === 0) {
      return res.status(202).json({
        success: false,
        message: 'No se encontraron clientes con casilleros.'
      });
    }
    return res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error al obtener los clientes con casilleros:', error);
    return res.status(500).json({
      success: false,
      message: 'Hubo un error en el servidor. Intente nuevamente más tarde.'
    });
  }
};
export const GetCustomerPackages = async (req, res, next) => {
  const {
    COD_CUSTOMER
  } = req.params;
  try {
    const result = await sequelize.query('CALL GET_CUSTOMER_PACKAGES(:COD_CUSTOMER)', {
      replacements: {
        COD_CUSTOMER
      }
    });
    const packages = Array.isArray(result) ? result : [];
    if (packages.length === 0) {
      return res.status(202).json({
        ok: false,
        message: 'No hay paquetes disponibles todavía.'
      });
    }
    return res.status(200).json({
      ok: true,
      packages
    });
  } catch (error) {
    console.error('Error fetching customer packages:', error);
    res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
    next();
  }
};
export const getCustomerAddressAndPhone = async (req, res) => {
  const {
    cod_customer
  } = req.params;
  try {
    const result = await sequelize.query('CALL GET_CUSTOMER_ADDRESS_AND_PHONE(:cod_customer)', {
      replacements: {
        cod_customer
      },
      type: sequelize.QueryTypes.RAW
    });
    if (result.length === 0) {
      return res.status(404).json({
        message: 'Cliente no encontrado'
      });
    }
    return res.status(200).json({
      phone: result[0].NUM_PHONE,
      address: result[0].DES_ADDRESS
    });
  } catch (error) {
    console.error('Error al obtener teléfono y dirección del cliente:', error);
    return res.status(500).json({
      message: 'Error al obtener teléfono y dirección del cliente',
      error: error.message
    });
  }
};
export const getAllCustomers = async (req, res) => {
  try {
    const [results] = await sequelize.query('CALL GET_ALL_CUSTOMERS()', {
      type: sequelize.QueryTypes.SELECT
    });
    if (results.length === 0) {
      return res.status(404).json({
        message: 'No se encontraron clientes.'
      });
    }
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al obtener la lista de clientes.'
    });
  }
};
export const getCustomersWithStateAndType = async (req, res) => {
  try {
    const results = await sequelize.query('CALL GET_CUSTOMERS_WITH_STATE_AND_TYPE()', {
      type: sequelize.QueryTypes.RAW
    });
    if (!results || results.length === 0) {
      return res.status(202).json({
        message: 'No hay clientes todavía'
      });
    }
    res.status(200).json([...results]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al obtener la lista de clientes'
    });
  }
};
export const updateCustomerStateAndType = async (req, res) => {
  const {
    codUser,
    newIndUsr,
    newIndTypCust,
    usrUpd
  } = req.body;
  try {
    const result = await sequelize.query('CALL UPD_CUSTOMERS_WITH_STATE_AND_TYPE(:codUser, :newIndUsr, :newIndTypCust, :usrUpd)', {
      replacements: {
        codUser: codUser,
        newIndUsr: newIndUsr,
        newIndTypCust: newIndTypCust,
        usrUpd: usrUpd
      },
      type: sequelize.QueryTypes.RAW
    });
    res.json({
      success: true,
      message: result[0].mensaje
    });
  } catch (error) {
    console.error('Error al actualizar:', error);
    res.status(500).json({
      success: false,
      message: 'Ocurrió un error al actualizar.',
      error: error.message
    });
  }
};