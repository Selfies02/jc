import sequelize from "../config/database/index.js";
import path from 'path';
import { transport, getPackageInTransitEmailTemplate, postPackageInTransitBodega, getPackageInTransitLlegada } from '../email/index.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const insertPackage = async (req, res) => {
  const {
    cod_customer,
    cod_locker,
    tracking
  } = req.body;
  if (!cod_customer || !cod_locker || !tracking || !req.file) {
    return res.status(400).json({
      message: 'Todos los campos son requeridos.'
    });
  }
  let imagen = path.join('assets', 'package', req.file.filename);
  imagen = imagen.replace(/\\/g, '/');
  try {
    const [result] = await sequelize.query(`CALL INS_PACKAGE(:cod_customer, :cod_locker, :tracking, :imagen)`, {
      replacements: {
        cod_customer,
        cod_locker,
        tracking,
        imagen
      }
    });
    const [rows] = await sequelize.query(`SELECT p.FIRSTNAME, p.LASTNAME, e.EMAIL 
       FROM LO_CUSTOMERS c
       JOIN PA_PEOPLE p ON p.COD_PEOPLE = c.COD_USER
       JOIN PA_EMAILS e ON e.COD_PEOPLE = p.COD_PEOPLE
       WHERE c.COD_CUSTOMER = :cod_customer`, {
      replacements: {
        cod_customer
      }
    });
    if (rows.length > 0) {
      const {
        FIRSTNAME,
        LASTNAME,
        EMAIL
      } = rows[0];
      const fullImagePath = path.join(__dirname, '..', imagen);
      const emailTemplate = postPackageInTransitBodega(FIRSTNAME, LASTNAME, EMAIL, tracking, fullImagePath);
      await transport.sendMail(emailTemplate);
    }
    return res.status(200).json({
      message: result.Resultado || 'Paquete insertado correctamente.'
    });
  } catch (error) {
    console.error('Error al insertar paquete:', error);
    return res.status(500).json({
      message: 'Error al insertar paquete en tránsito.'
    });
  }
};
export const getPackageStatus = async (req, res) => {
  try {
    const results = await sequelize.query('CALL GET_PACKAGE_STATUS();', {
      type: sequelize.QueryTypes.RAW
    });
    if (!results || results.length === 0) {
      return res.status(202).json({
        success: false,
        message: 'No hay paquetes todavía.'
      });
    }
    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error al obtener el estado de los paquetes:', error);
    res.status(500).json({
      success: false,
      message: 'Hubo un error en el servidor. Intente nuevamente más tarde.'
    });
  }
};
export const getPackageStatusEnBodega = async (req, res) => {
  try {
    const results = await sequelize.query('CALL GET_PACKAGE_STATUS_EN_BODEGA();', {
      type: sequelize.QueryTypes.RAW
    });
    if (!results || results.length === 0) {
      return res.status(202).json({
        success: false,
        message: 'No hay paquetes todavía.'
      });
    }
    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error al obtener el estado de los paquetes:', error);
    res.status(500).json({
      success: false,
      message: 'Hubo un error en el servidor. Intente nuevamente más tarde.'
    });
  }
};
export const getPackageStatusEnTransito = async (req, res) => {
  try {
    const results = await sequelize.query('CALL GET_PACKAGE_STATUS_EN_TRANSITO();', {
      type: sequelize.QueryTypes.RAW
    });
    if (!results || results.length === 0) {
      return res.status(202).json({
        success: false,
        message: 'No hay paquetes todavía.'
      });
    }
    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error al obtener el estado de los paquetes:', error);
    res.status(500).json({
      success: false,
      message: 'Hubo un error en el servidor. Intente nuevamente más tarde.'
    });
  }
};
export const getPackageStatusListoParaRetirar = async (req, res) => {
  try {
    const results = await sequelize.query('CALL GET_PACKAGE_STATUS_LISTO_PARA_RETIRAR();', {
      type: sequelize.QueryTypes.RAW
    });
    if (!results || results.length === 0) {
      return res.status(202).json({
        success: false,
        message: 'No hay paquetes todavía.'
      });
    }
    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error al obtener el estado de los paquetes:', error);
    res.status(500).json({
      success: false,
      message: 'Hubo un error en el servidor. Intente nuevamente más tarde.'
    });
  }
};
export const updatePackageStatus = async (req, res) => {
  const {
    cod_locker
  } = req.body;
  if (!cod_locker) {
    return res.status(400).json({
      message: 'El campo cod_locker es requerido.'
    });
  }
  try {
    const [packages] = await sequelize.query(`SELECT 
        e.EMAIL AS email, 
        p.FIRSTNAME AS nombre, 
        p.LASTNAME AS apellido,
        GROUP_CONCAT(DISTINCT ltp.TRACKING SEPARATOR ', ') AS trackings,
        GROUP_CONCAT(DISTINCT ltp.IMAGEN SEPARATOR ', ') AS imagenes
      FROM 
        LO_CUSTOMERS c
        JOIN SE_USERS u ON c.COD_USER = u.COD_USER
        JOIN PA_PEOPLE p ON u.COD_PEOPLE = p.COD_PEOPLE
        JOIN PA_EMAILS e ON p.COD_PEOPLE = e.COD_PEOPLE
        JOIN LO_TRANSIT_PACKAGES ltp ON c.COD_CUSTOMER = ltp.COD_CUSTOMER
      WHERE 
        ltp.COD_LOCKER = :cod_locker
        AND ltp.ESTADO = 'EN BODEGA'
      GROUP BY 
        e.EMAIL, p.FIRSTNAME, p.LASTNAME`, {
      replacements: {
        cod_locker
      }
    });
    if (packages.length === 0) {
      return res.json({
        success: false,
        message: 'No se encontraron paquetes con estado EN BODEGA para notificar.'
      });
    }
    await sequelize.query('CALL UPDATE_AND_NOTIFY_PACKAGE_STATUS(:cod_locker, @p_success, @p_message)', {
      replacements: {
        cod_locker
      }
    });
    const [output] = await sequelize.query('SELECT @p_success AS success, @p_message AS message');
    const success = output[0].success === '1' || output[0].success === 1 || output[0].success === true;
    if (!success) {
      return res.json({
        success: false,
        message: output[0].message
      });
    }
    for (const packageInfo of packages) {
      const mailOptions = getPackageInTransitEmailTemplate(packageInfo.nombre, packageInfo.apellido, packageInfo.email, packageInfo.trackings, packageInfo.imagenes);
      await transport.sendMail(mailOptions);
    }
    return res.json({
      success: true,
      message: 'Actualización exitosa y notificaciones enviadas.'
    });
  } catch (error) {
    console.error('Error al actualizar el estado de los paquetes:', error);
    return res.status(500).json({
      message: 'Error al actualizar el estado de los paquetes.'
    });
  }
};
export const updatePackageStatusLlegada = async (req, res) => {
  const {
    cod_locker
  } = req.body;
  if (!cod_locker) {
    return res.status(400).json({
      message: 'El campo cod_locker es requerido.'
    });
  }
  try {
    const [packages] = await sequelize.query(`SELECT 
        e.EMAIL AS email, 
        p.FIRSTNAME AS nombre, 
        p.LASTNAME AS apellido,
        GROUP_CONCAT(DISTINCT ltp.TRACKING SEPARATOR ', ') AS trackings,
        GROUP_CONCAT(DISTINCT ltp.IMAGEN SEPARATOR ', ') AS imagenes
      FROM 
        LO_CUSTOMERS c
        JOIN SE_USERS u ON c.COD_USER = u.COD_USER
        JOIN PA_PEOPLE p ON u.COD_PEOPLE = p.COD_PEOPLE
        JOIN PA_EMAILS e ON p.COD_PEOPLE = e.COD_PEOPLE
        JOIN LO_TRANSIT_PACKAGES ltp ON c.COD_CUSTOMER = ltp.COD_CUSTOMER
      WHERE 
        ltp.COD_LOCKER = :cod_locker
        AND ltp.ESTADO = 'EN TRANSITO'
      GROUP BY 
        e.EMAIL, p.FIRSTNAME, p.LASTNAME`, {
      replacements: {
        cod_locker
      }
    });
    if (packages.length === 0) {
      return res.json({
        success: false,
        message: 'No se encontraron paquetes con estado EN TRANSITO para notificar.'
      });
    }
    await sequelize.query('CALL UPDATE_AND_NOTIFY_PACKAGE_STATUS_LLEGADA(:cod_locker, @p_success, @p_message)', {
      replacements: {
        cod_locker
      }
    });
    const [output] = await sequelize.query('SELECT @p_success AS success, @p_message AS message');
    const success = output[0].success === '1' || output[0].success === 1 || output[0].success === true;
    if (!success) {
      return res.json({
        success: false,
        message: output[0].message
      });
    }
    for (const packageInfo of packages) {
      const mailOptions = getPackageInTransitLlegada(packageInfo.nombre, packageInfo.apellido, packageInfo.email, packageInfo.trackings, packageInfo.imagenes);
      await transport.sendMail(mailOptions);
    }
    return res.json({
      success: true,
      message: 'Actualización exitosa y notificaciones enviadas.'
    });
  } catch (error) {
    console.error('Error al actualizar el estado de los paquetes:', error);
    return res.status(500).json({
      message: 'Error al actualizar el estado de los paquetes.'
    });
  }
};
export const getPackageCounts = async (req, res) => {
  try {
    const result = await sequelize.query('CALL GET_PACKAGES_COUNT()');
    const packageCounts = Array.isArray(result) ? result : [];
    if (packageCounts.length === 0) {
      return res.status(202).json({
        ok: false,
        message: 'No hay paquetes disponibles todavía.'
      });
    }
    return res.status(200).json({
      ok: true,
      packageCounts
    });
  } catch (error) {
    console.error('Error fetching package counts:', error);
    res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
};