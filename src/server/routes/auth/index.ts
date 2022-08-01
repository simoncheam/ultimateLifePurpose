import { Router } from "express";

import registerRouter from './register'
import loginRouter from './login'
import validateRouter from './validate'
import verifyRouter from './verify'
import resetRouter from './reset'
import resetVerifyRouter from './resetverify'

const router = Router();

router.use('/register', registerRouter);
router.use('/login', loginRouter);
router.use('/validate', validateRouter);
router.use('/verify', verifyRouter);
router.use('/reset', resetRouter);
router.use('/resetverify', resetVerifyRouter);

export default router;