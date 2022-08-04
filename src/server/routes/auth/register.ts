import * as jwt from 'jsonwebtoken';
import config, { jwt_config } from '../../config';
import usersDB from '../../database/queries/users'

import { Router } from 'express';
import { generateHash } from '../../utils/passwords'
import { send_confirmation_email } from '../services/registration_confirmation';
import { Users } from '../../types';
import validators from '../../utils/validators';


const router = Router();

router.post('/', async (req, res, next) => {

    const newUser: Users = req.body;





    try {
        await validators.isValidEmail(newUser.email!);


        // if (!emailValid) return res.status(400).json({ message: "Invalid email!" })

        console.log('-- PASSED EMAIL REGEX')

        // create new hash
        newUser.password = generateHash(newUser.password!);


        //insert new user into db
        const result = await usersDB.create(newUser);

        result.insertId
        // jwt needs userid for token


        //create new token
        const token = jwt.sign(

            { id: result.insertId, email: newUser.email },
            config.jwt_config.secret!,
            { expiresIn: jwt_config.expiration }
        );

        send_confirmation_email(newUser.email!)

        res.status(201).json({
            message: 'successful registration -- Check Email', id: newUser.id
        });

    } catch (error) {
        console.log(error);

        if ('bad_data' in error) {
            res.status(400).json({ message: error.bad_data })
        } else {

            res.status(500).json({ message: error.mesage || 'Server error occurred during registration', error })

        }


        next(error)
    }

})





export default router;