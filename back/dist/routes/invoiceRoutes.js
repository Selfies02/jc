import express from 'express';
import { insertInvoiceAndCharges, getInvoiceTotalsByPeriod, getNumInvoice, getInvoiceDetailsByCustomer } from '../controllers/InvoiceController.js';
import { verifyToken } from '../middleware/utils/verifyToken.js';
const router = express.Router();
router.post('/invoiceAndCharges', verifyToken, insertInvoiceAndCharges);
router.get('/invoiceTotals', verifyToken, getInvoiceTotalsByPeriod);
router.get('/invoiceNumber', verifyToken, getNumInvoice);
router.get('/customerInvoices/:codCustomer', verifyToken, getInvoiceDetailsByCustomer);
export default router;