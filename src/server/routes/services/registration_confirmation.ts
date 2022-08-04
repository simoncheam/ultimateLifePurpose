import * as jwt from 'jsonwebtoken';
import config, { jwt_config, DEV_URL_BASE, URL_BASE } from '../../config';
import usersDB from '../../database/queries/users';

//! this takes in user id and email

export const send_confirmation_email = async (email: string) => {
  const sgMail: any = require('@sendgrid/mail');

  const [user] = await usersDB.getUserBy('email', email);

  // * create temp token for email validation
  const tempToken = jwt.sign({ email: user.email }, jwt_config.tempSecret!, {
    expiresIn: jwt_config.tempExpiration,
  });

  sgMail.setApiKey(config.sendgrid_config.apiKey);

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
      email: 'simon@simoncheam.dev',
    }, // * verified sender
    subject: 'please verify your account',
    text: 'and easy to do anywhere, even with Node.js',
    html: `<a href="${URL_BASE}/verify?email=${email}&token=${tempToken}"> Click to confirm your account </a>`,
  };

  //<a href="${DEV_URL_BASE}/verify?email=${email}&token=${tempToken}"> Click to confirm your account(dev) </a>

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error: string) => {
      console.error(error);
    });
};
