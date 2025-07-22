import { Router } from 'express';
import { convertCurrency, getCurrencies } from '../controllers/currencyController';

const router = Router();

router.post('/convert', convertCurrency);
router.get('/list', getCurrencies);

export default router; 