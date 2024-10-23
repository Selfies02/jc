import { Router } from 'express';
import { getAllCustomersWithLockers, GetCustomerPackages, getCustomerAddressAndPhone, getAllCustomers, getCustomersWithStateAndType, updateCustomerStateAndType } from '../controllers/CustomerController.js'; // Importar el controlador
import { verifyToken } from '../middleware/utils/verifyToken.js';
const router = Router();
router.get('/customers-lockers', verifyToken, getAllCustomersWithLockers);
router.get('/customer-packages/:COD_CUSTOMER', verifyToken, GetCustomerPackages);
router.get('/address-phone/:cod_customer', verifyToken, getCustomerAddressAndPhone);
router.get('/', verifyToken, getAllCustomers);
router.get('/stateAndType', verifyToken, getCustomersWithStateAndType);
router.post('/update/stateAndType', verifyToken, updateCustomerStateAndType);
export default router;