// controllers/lockerController.js
import sequelize from "../config/database/index.js";

export const getLockers = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const results = await sequelize.query('CALL GET_LOCKERS_BY_USER(:customerId)', {
      replacements: { customerId }
    });

    const lockers = Array.isArray(results) ? results : [];
    res.json(lockers);
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ message: 'Error al obtener los lockers', error: error.message });
  }
};


export const openVirtualLocker = async (req, res) => {
  const { cod_customer, cod_locker } = req.body;
  try {
    await sequelize.query(
      'CALL INS_REL_LOCKER_CUSTOMER(:cod_customer, :cod_locker, @p_locker_code, @p_success, @p_message)',
      {
        replacements: {
          cod_customer,
          cod_locker,
        },
      }
    );

    const [output] = await sequelize.query(
      'SELECT @p_locker_code AS locker_code, @p_success AS success, @p_message AS message'
    );

    const success =
      output[0].success === '1' || output[0].success === 1 || output[0].success === true;

    return res.json({
      lockerCode: output[0].locker_code,
      success,
      message: output[0].message,
    });
  } catch (error) {
    console.error('Error al abrir el casillero virtual:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const getLockerPrice = async (req, res, next) => {
  const { codLocker } = req.params;

  if (!codLocker) {
    return res.status(400).json({ message: 'Código del locker es requerido' });
  }

  try {
    const locker = await sequelize.query('CALL GET_LOCKER_PRICE(:codLocker)', {
      replacements: { codLocker },
    });

    if (!Array.isArray(locker) || locker.length === 0) {
      return res.status(404).json({ ok: false, error: 'Locker no encontrado' });
    }

    const price = locker[0].PRECIO;

    return res.status(200).json({ ok: true, price });
  } catch (error) {
    console.error('Error al obtener el precio del locker:', error);
    res.status(500).json({ ok: false, error: 'Error al obtener el precio del locker' });
    next();
  }
};



