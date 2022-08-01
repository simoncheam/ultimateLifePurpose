import { Router } from "express";

import metricsRouter from './usermetrics';
import valuesRouter from './values';
import habitsRouter from './userhabits';
import contactRouter from './contact';

const router = Router();

router.use('/values', valuesRouter);
router.use('/usermetrics', metricsRouter);
router.use('/userhabits', habitsRouter);
router.use('/contact', contactRouter);

export default router; 