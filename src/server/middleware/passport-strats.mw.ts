import * as passport from 'passport';
import * as PassportJWT from 'passport-jwt';
import * as LocalStrategy from "passport-local";
import * as bcrypt from "bcrypt";
import { Application } from 'express';
import { Payload, Users } from '../types';
import config from '../config';
import usersDB from '../database/queries/users';
import { send_confirmation_email } from '../routes/services/registration_confirmation';
import Swal from 'sweetalert2'


export function configurePassport(app: Application) {

    passport.serializeUser((user: Users, done) => {

        if (user?.password) delete user.password;
        done(null, user);
    });

    passport.deserializeUser((user: Users, done) => {
        if (user?.password) delete user.password;
        done(null, user)
    });

    passport.use(
        new LocalStrategy.Strategy({
            usernameField: "email"
        },
            async (email, password, done) => {

                console.log('passport-strats middleware check...');

                try {

                    if (!email || !password) return done("Missing one or more fields", false);

                    const [user] = await usersDB.getUserBy('email', email);


                    if (!user) return done({ message: " invalid credentials" }, false);



                    const isMatch = await bcrypt.compare(password, user?.password!);

                    console.log('BCRYPT - compare');
                    console.log(isMatch);

                    if (!isMatch) {
                        console.log('NO MATCH');
                        done({ message: "Invalid credentials" }, false);
                    } else {

                        // !!! Check if verified
                        if (!user.isVerified && user) {

                            // ! send confirmation email if user exists, but not verified
                            send_confirmation_email(user.email!)




                            throw new Error("Not verified, please check your email");
                        }



                        delete user.password;
                        done(null, user);
                    }

                } catch (error) {
                    console.log(error);
                    done(error, false);

                }
            }
        )
    );

    passport.use(new PassportJWT.Strategy({

        jwtFromRequest: PassportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwt_config.secret

    }, (payload: Payload, done) => {

        try {
            done(null, payload);
        } catch (error) {
            done(error)

        }
    }))



    app.use(passport.initialize())





}