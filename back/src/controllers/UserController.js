import sequelize from '../config/database/index.js';
import { hashPassword } from '../helpers/bcrypt.js';

export const getUserDetails = async (req, res) => {
    const { cod_user } = req.params;

    try {
        const [results] = await sequelize.query(`
            CALL GET_USER_DETAILS_BY_COD_USER(:cod_user)
        `, {
            replacements: { cod_user }
        });

        res.json(results);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'An error occurred while fetching user details.' });
    }
};

export const changePassword = async (req, res) => {
    const { cod_user, new_password, usr_upd } = req.body;

    try {
        const hashedPassword = await hashPassword(new_password);

        const result = await sequelize.query(
            'CALL UPD_USER_PASSWORD(:p_cod_user, :p_new_password, :p_usr_upd)',
            {
                replacements: {
                    p_cod_user: cod_user,
                    p_new_password: hashedPassword,
                    p_usr_upd: usr_upd
                },
                type: sequelize.QueryTypes.RAW
            }
        );

        res.json({
            success: true,
            message: result[0].mensaje
        });
    } catch (error) {
        console.error('Error en changePassword:', error);
        res.status(500).json({
            success: false,
            message: 'Ocurrió un error al cambiar la contraseña.',
            error: error.message
        });
    }
};

export const updateUserDetails = async (req, res) => {
    const {
        cod_user,
        firstname,
        middlename,
        lastname,
        email,
        num_phone,
        cod_country,
        cod_state,
        cod_city,
        des_address,
        usr_upd
    } = req.body;
    try {
        const [result] = await sequelize.query(
            `CALL UPD_USER_DETAILS(:cod_user, :firstname, :middlename, :lastname,
            :email, :num_phone, :cod_country, :cod_state, :cod_city, :des_address, :usr_upd)`,
            {
                replacements: {
                    cod_user,
                    firstname,
                    middlename,
                    lastname,
                    email,
                    num_phone,
                    cod_country,
                    cod_state,
                    cod_city,
                    des_address,
                    usr_upd
                }
            }
        );

        if (result && result.mensaje) {
            return res.status(200).json({ success: true, message: result.mensaje });
        } else {
            return res.status(500).json({ success: false, message: 'No se obtuvo respuesta', result });
        }
    } catch (error) {
        console.error('Error in updateUserDetails:', error);
        return res.status(500).json({ success: false, message: 'Ocurrió un error al actualizar los detalles del usuario', error: error.message });
    }
};
