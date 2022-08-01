import * as jwt from 'jsonwebtoken'
import config, { jwt_config, DEV_URL_BASE, URL_BASE } from '../../config';
import usersDB from '../../database/queries/users'



//! this takes in user id and email

export const send_reset_confirmation_email = async (email: string) => {

    const sgMail: any = require('@sendgrid/mail')

    const [user] = await usersDB.getUserBy('email', email)

    console.log(user)

    // * create temp token for email validation
    const tempToken = jwt.sign(

        { email: user.email },
        jwt_config.tempSecret!,
        { expiresIn: jwt_config.tempExpiration }
    );

    console.log({ tempToken })



    sgMail.setApiKey(config.sendgrid_config.apiKey)

    const msg: {
        to: string;
        from: {};
        subject: string;
        text: string;
        html: string;
    } = {
        to: `${email}`, //  recipient
        from: {
            name: 'Your Life Purpose',
            email: 'simon@simoncheam.dev'
        },
        subject: 'please verify your reset request',
        text: 'and easy to do anywhere, even with Node.js', // ! this is not working!
        html: `<a href="${URL_BASE}/resetverify?email=${email}&token=${tempToken}"> Click to update your password </a>  \n\n

        If you did not request a password change, you can ignore this email. Have a nice day:)`
    }


    sgMail.send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error: string) => {
            console.error(error)
        })
}