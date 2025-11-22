import { Router } from 'express';
import * as UserController from './userController';

const router = Router();

router.get('/', UserController.listUsers);

export default router;