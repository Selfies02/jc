import sequelize from '../config/database/index.js';

export const GetCountries = async (req, res, next) => {
  try {
    const Countries = await sequelize.query('CALL GET_COUNTRIES()');

    if (!Array.isArray(Countries) || Countries.length === 0) {
      return res.status(404).json({ ok: false, error: 'No countries found' });
    }

    return res.status(200).json({ ok: true, Countries });
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ ok: false, error: 'Internal server error' });
    next();
  }
};
