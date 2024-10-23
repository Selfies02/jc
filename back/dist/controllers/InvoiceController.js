import sequelize from '../config/database/index.js';
import { QueryTypes } from 'sequelize';
import fs from 'fs/promises';
import path from 'path';
import multer from 'multer';
const upload = multer({
  dest: 'src/assets/facturas/'
});
export const insertInvoiceAndCharges = [upload.single('pdfFile'), async (req, res) => {
  const invoiceData = JSON.parse(req.body.invoiceData);
  const {
    usr_add,
    charges
  } = invoiceData;
  if (!usr_add || !Array.isArray(charges) || charges.length === 0) {
    return res.status(400).json({
      error: 'Datos inválidos o incompletos'
    });
  }
  let pdfPath = '';
  try {
    if (req.file) {
      const tempPath = req.file.path;
      const now = new Date();
      const dateString = now.toISOString().replace(/:/g, '-').split('.')[0];
      const formattedDate = dateString.replace('T', '_');
      const uniqueFileName = `${formattedDate}-${req.file.originalname}`;
      const targetPath = path.posix.join('src/assets/facturas', uniqueFileName);
      const finalPathForDb = path.posix.join('assets/facturas', uniqueFileName);
      await fs.rename(tempPath, targetPath);
      pdfPath = finalPathForDb;
    }
    const [results] = await sequelize.query(`CALL INS_INVOICE_AND_MULTIPLE_CHARGES(:usr_add, :charges, :pdfPath)`, {
      replacements: {
        usr_add,
        charges: JSON.stringify(charges),
        pdfPath
      },
      type: QueryTypes.RAW
    });
    return res.status(201).json({
      message: 'Factura y cargos insertados exitosamente',
      details: results
    });
  } catch (error) {
    console.error('Error al insertar factura y cargos:', error);
    if (error.original && error.original.sqlState === '45000') {
      return res.status(400).json({
        error: error.original.message
      });
    }
    return res.status(500).json({
      error: 'Ocurrió un error al insertar la factura y los cargos'
    });
  }
}];
export const getInvoiceTotalsByPeriod = async (req, res) => {
  const {
    period
  } = req.query;
  if (period && !['day', 'month', 'year'].includes(period)) {
    return res.status(400).json({
      ok: false,
      message: 'Parámetro de período inválido. Use "day", "month" o "year".'
    });
  }
  try {
    const result = await sequelize.query('CALL GET_INVOICE_TOTALS_BY_PERIOD(:period)', {
      replacements: {
        period: period || null
      }
    });
    const invoiceTotals = Array.isArray(result) ? result : [];
    if (invoiceTotals.length === 0) {
      return res.status(202).json({
        ok: false,
        message: 'No hay datos de facturas disponibles todavía.'
      });
    }
    return res.status(200).json({
      ok: true,
      invoiceTotals
    });
  } catch (error) {
    console.error('Error fetching invoice totals by period:', error);
    res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
};
export const getNumInvoice = async (req, res) => {
  try {
    const [results] = await sequelize.query('CALL GET_NUM_INVOICE()');
    res.json(results);
  } catch (error) {
    console.error('Error executing stored procedure:', error);
    res.status(500).json({
      error: 'Error executing stored procedure'
    });
  }
};
export const getInvoiceDetailsByCustomer = async (req, res) => {
  const {
    codCustomer
  } = req.params;
  try {
    const results = await sequelize.query('CALL GET_INVOICE_DETAILS_BY_CUSTOMER(:codCustomer)', {
      replacements: {
        codCustomer
      }
    });
    const invoiceDetails = Array.isArray(results) ? results : [];
    if (invoiceDetails.length === 0) {
      return res.status(200).json({
        message: 'No hay facturas para este cliente todavía'
      });
    }
    res.status(200).json(invoiceDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al obtener los detalles de la factura.'
    });
  }
};