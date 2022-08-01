import * as jwt from 'jsonwebtoken'
import { Router } from "express";
import config, { jwt_config } from "../../config";
import { ReqUser } from "../../types";
import usersDB from '../../database/queries/users';
import { send_reset_confirmation_email } from '../services/reset_confirmation';

const router = Router();

// ! Verify email auth route
router.get(`/`, async (req, res) => {


    try {
        // ! pull token from params
        const { token, email }: any = req.query;


        jwt.verify(token, jwt_config.tempSecret!, async (error: any, authData: any) => {

            if (error) {

                // ! email link again if tempToken expires
                send_reset_confirmation_email(email)

                res.status(403).json({ message: "Link expired - Check Email!" });
                return
            } else {



                // ! update user account in DB
                let [user] = await usersDB.getUserBy('email', email);




                // ! assign REAL token
                const realToken = jwt.sign(

                    { id: user.id, email: user.email },
                    config.jwt_config.secret!,
                    { expiresIn: jwt_config.expiration }
                );



                console.log({ realToken })
                res.status(200).json({
                    message: 'verification successful',
                    token: realToken,
                    authData
                });
            }
        })


    } catch (error) {
        console.log(error)

    }




})


export default router;