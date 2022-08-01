import * as jwt from 'jsonwebtoken';
import config, { jwt_config } from '../../config';
import usersDB from '../../database/queries/users'

import { Router } from 'express';
import { generateHash } from '../../utils/passwords'
import { send_reset_confirmation_email } from '../services/reset_confirmation';
import { tokenCheck } from '../../middleware/tokenCheck.mw';
import { ReqUser } from '../../types';

const router = Router();

//! need to get user by email

router.post('/', async (req, res) => {

    const newUserReset = req.body;

    try {

        const [user] = await usersDB.getUserBy('email', newUserReset.email)

        if (!user) {
            return res.status(404).json({ message: "User with that email not found " })
        }

        send_reset_confirmation_email(newUserReset.email)

        res.status(201).json({
            message: 'successful registration -- Check Email', id: newUserReset.id
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error occurred during registration', error })

    }

})


router.put('/', tokenCheck, async (req: ReqUser, res) => {

    const newUserUpdate = req.body;
    const userid = req.user!.id;

    try {

        let [user] = await usersDB.getUserBy('email', newUserUpdate.email)

        if (!user) {
            return res.status(404).json({ message: "User with that email not found " })
        }

        // create new hash
        newUserUpdate.password = generateHash(newUserUpdate.password);

        //insert updated pw hash into db

        // ! ------  update password in /auth/reset (PUT route)
        await usersDB.update(
            {
                ...user,
                password: newUserUpdate.password
            },
            userid)

        res.status(201).json({
            message: 'successful password update', id: newUserUpdate.id
        });

    } catch (error) {
        console.log(error);

        //! send reset confirmation (newUserReset.email)
        send_reset_confirmation_email(newUserUpdate.email)



        res.status(500).json({ message: 'Server error occurred during registration', error })

    }

})














export default router;