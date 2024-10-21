import sequelize from '../config/database/index.js';

export const GetStatesForCountry = async (req, res, next) => {
  const { COD_COUNTRY } = req.params;

  try {
    const States = await sequelize.query('CALL GET_STATE_FOR_COUNTRY(:COD_COUNTRY)', {
      replacements: { COD_COUNTRY },
    });

    if (!Array.isArray(States) || States.length === 0) {
      return res.status(404).json({ ok: false, error: 'No states found for the country' });
    }

    return res.status(200).json({ ok: true, States });
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({ ok: false, error: 'Internal server error' });
    next();
  }
};
