import { Router } from 'express';

import authRouter from './auth';
import apiRouter from './api';

const router = Router();

router.use('/auth', authRouter);
router.use('/api', apiRouter);

export default router;