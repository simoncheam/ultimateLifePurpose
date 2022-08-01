import * as jwt from 'jsonwebtoken'
import config, { jwt_config, DEV_URL_BASE, URL_BASE } from '../../config';
import usersDB from '../../database/queries/users'



//! this takes in user id and email

export const send_contact_email = async (email: string, userName: string, message: string) => {

    console.log('---- ')
    console.log(' Sending Contact Email')
    console.log('---- ')

    const sgMail: any = require('@sendgrid/mail')

    //const [user] = await usersDB.getUserBy('email', email)

    // * create temp token for email validation





    sgMail.setApiKey(config.sendgrid_config.apiKey)

    const msg: {
        to: string;
        cc: string;
        from: {};
        subject: string;
        text: string;
        //html: string;
    } = {
        to: `${email}`, // Change to your recipient
        cc: 'simon@simoncheam.dev',
        from: {
            name: 'Simon',
            email: 'simon@simoncheam.dev'
        },
        subject: `Thanks for reaching out, ${userName}!`,
        text: `Hey, ${userName}!\n\n
Thanks for the message:

Here's what we got from you:\n"${message}"

Feel free to respond to this if you have any questions.
Have a great day!☺️

-Simon
www.simoncheam.dev
`,
        //html: `<br><br>`,
    }



    sgMail.send(msg)
        .then(() => {
            console.log('Contact Email sent')
        })
        .catch((error: string) => {
            console.error(error)
        })
}