import { tokenCheck } from "../../middleware/tokenCheck.mw";
import { ReqUser } from "../../types";
import usersDB from '../../database/queries/users';
import { Router } from "express";
import { send_contact_email } from "../services/contact_confirmation";
import validators from "../../utils/validators";

const router = Router();



// POST request
router.post('/', tokenCheck, async (req: ReqUser, res) => {

    const userid = req.user!!.id

    try {

        const { email, message, userName } = req.body;

        // input validation
        if (!email || !message || !userName) {
            return res.status(400).json({
                message: "Fill out everything!"
            })
        }

        await validators.isValidEmail(email);


        // * check if email exists
        const [user] = await usersDB.getUserBy('email', email);

        if (!user) {
            return res.status(404).json({
                message: "user with that email address does not exist. Check email spelling."
            })
        }

        send_contact_email(email, userName, message);


        res.status(200).json({
            message: 'Thanks for your message '
        });

    } catch (error) {
        console.log(error)

        if ('bad_data' in error) {
            res.status(400).json({ message: error.bad_data })
        } else {


            res.status(500).json({ message: "A server errors occurred", error: error.sqlMessage });
        }

    }
})

export default router;