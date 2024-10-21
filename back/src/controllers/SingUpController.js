import sequelize from '../config/database/index.js';
import { hashPassword } from '../helpers/bcrypt.js';
import jwt from 'jsonwebtoken';
import { transport, configTransportVery } from '../email/index.js';

const JWTSECRET = process.env.JWTSECRET;

export const SignUp = async (req, res) => {
    const {
        p_ID,
        p_TIP_DOCUMENT,
        p_FIRSTNAME,
        p_MIDDLENAME,
        p_LASTNAME,
        p_AGE,
        p_DAT_BIRTH,
        p_USR_ADD,
        p_PAS_USER,
        p_COD_ROL,
        p_NUM_AREA,
        p_NUM_PHONE,
        p_EMAIL,
        p_COD_COUNTRY,
        p_COD_STATE,
        p_COD_CITY,
        p_DES_ADDRESS
    } = req.body;

    if (!p_ID || !p_TIP_DOCUMENT || !p_FIRSTNAME || !p_LASTNAME || !p_AGE || !p_DAT_BIRTH || !p_USR_ADD || !p_PAS_USER || !p_COD_ROL) {
        return res.status(400).json({
            message: 'Faltan algunos campos obligatorios.'
        });
    }

    try {
        const hashedPassword = await hashPassword(p_PAS_USER);

        const result = await sequelize.query(
            `CALL INS_USER_WITH_LOCKERS(
                :p_ID, :p_TIP_DOCUMENT, :p_FIRSTNAME, :p_MIDDLENAME, :p_LASTNAME,
                :p_AGE, :p_DAT_BIRTH, :p_USR_ADD, :p_PAS_USER, :p_COD_ROL,
                :p_NUM_AREA, :p_NUM_PHONE, :p_EMAIL, :p_COD_COUNTRY,
                :p_COD_STATE, :p_COD_CITY, :p_DES_ADDRESS
            )`,
            {
                replacements: {
                    p_ID,
                    p_TIP_DOCUMENT,
                    p_FIRSTNAME,
                    p_MIDDLENAME: p_MIDDLENAME || null,
                    p_LASTNAME,
                    p_AGE,
                    p_DAT_BIRTH,
                    p_USR_ADD,
                    p_PAS_USER: hashedPassword,
                    p_COD_ROL,
                    p_NUM_AREA: p_NUM_AREA || null,
                    p_NUM_PHONE: p_NUM_PHONE || null,
                    p_EMAIL,
                    p_COD_COUNTRY: p_COD_COUNTRY || null,
                    p_COD_STATE: p_COD_STATE || null,
                    p_COD_CITY: p_COD_CITY || null,
                    p_DES_ADDRESS: p_DES_ADDRESS || null
                }
            }
        );

        const generatedCODUser = result[0] ? result[0].COD_USER_GENERATED : null;

        if (!generatedCODUser) {
            return res.status(500).json({
                message: 'No se pudo obtener el COD_USER del nuevo usuario.'
            });
        }

        const token = jwt.sign(
            {
                email: p_EMAIL,
                id: generatedCODUser
            },
            JWTSECRET,
            { expiresIn: '7d' }
        );

        const mailOptions = configTransportVery(p_FIRSTNAME, p_LASTNAME, p_EMAIL, token, process.env.API_FRONT, p_ID);

        await transport.sendMail(mailOptions);

        res.status(200).json({
            message: 'Usuario insertado con éxito, correo de verificación enviado.',
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error al insertar usuario',
            error: error.message
        });
    }
};
