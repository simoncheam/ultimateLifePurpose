import * as jwt from 'jsonwebtoken';
import { Router } from 'express';
import config, { jwt_config } from '../../config';
import { ReqUser } from '../../types';
import { send_confirmation_email } from '../services/registration_confirmation';
import usersDB from '../../database/queries/users';

const router = Router();

// ! Verify email auth route
router.get(`/`, async (req, res) => {
  try {
    // ! pull token from params
    const { token, email }: any = req.query;

    jwt.verify(token, jwt_config.tempSecret!, async (error: any, authData: any) => {
      if (error) {
        // ! email link to confirm
        send_confirmation_email(email);

        res.status(403).json({ message: 'Not Verified - Check Email!' });
        return;
      } else {
        // ! update user account in DB
        let [user] = await usersDB.getUserBy('email', email);

        // ! update isVerified column
        await usersDB.update(
          {
            ...user,
            isVerified: 1,
          },
          user.id
        );

        // ! assign REAL token
        const realToken = jwt.sign({ id: user.id, email: user.email }, config.jwt_config.secret!, {
          expiresIn: jwt_config.expiration,
        });

        console.log({ realToken });
        res.status(200).json({
          message: 'verification successful',
          token: realToken,
          authData,
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

export default router;
