import { Router } from 'express';
import * as TransactionController from './transactionController';

const router = Router();

router.get('/', TransactionController.listTransactions);

export default router;