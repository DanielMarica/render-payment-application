import { Router } from 'express';
import * as TransferController from './transferController';

const router = Router();

router.get('/', TransferController.listTransfers);
router.post('/', TransferController.createTransfer);

export default router;