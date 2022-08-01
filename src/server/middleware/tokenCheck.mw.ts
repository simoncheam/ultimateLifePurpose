import * as passport from 'passport';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ReqUser } from '../types';
//req: Request, res: Response, next: NextFunction

export const tokenCheck: RequestHandler = (req, res, next) => {

    console.log('TOKEN CHECK...');
    passport.authenticate('jwt', (err, user, info) => {

        if (err) {
            return next(err)
        }

        if (info) {
            return res.status(401).json({
                message: 'Error while authenticating, please log in again',
                error: info.message
            });
        }

        if (!user) {

            return res.status(404).json({
                error: 'Error: User not found'
            })


        }


        if (user) {

            delete user.password;


            console.log('Token is good!');
            req.user = user;

            next();
        }

    })(req, res, next)

};