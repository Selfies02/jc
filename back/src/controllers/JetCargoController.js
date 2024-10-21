import sequelize from '../config/database/index.js';

export const getJetCargo = async (req, res) => {
  try {
    const [results] = await sequelize.query('CALL GET_JETCARGO()');
    res.json(results);
  } catch (error) {
    console.error('Error executing stored procedure:', error);
    res.status(500).json({ error: 'Error executing stored procedure' });
  }
};
