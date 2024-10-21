import sequelize from '../config/database/index.js';

export const GetCityForState = async (req, res, next) => {
  const { COD_STATE } = req.params;

  try {
    const city = await sequelize.query('CALL GET_CITY_FOR_STATE(:COD_STATE)', {
      replacements: { COD_STATE },
    });

    if (!Array.isArray(city) || city.length === 0) {
      return res.status(404).json({ ok: false, error: 'City not found' });
    }

    return res.status(200).json({ ok: true, city });
  } catch (error) {
    console.error('Error fetching city:', error);
    res.status(500).json({ ok: false, error: 'Internal server error' });
    next();
  }
};
