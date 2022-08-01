// we need to create routes for usersHabits Table

/*
- The habits view sends POST request to route

- We may also need a PUT request
- We may also want DESTROY request

- Fetching data?
The usermetrics route will use SP to get joined data for UM and UH tables

*/

import { Router } from "express";
import { ReqUser, UserHabits, userMetrics } from "../../types";
import userHabitsDB from '../../database/queries/userhabits'
import { tokenCheck } from "../../middleware/tokenCheck.mw";

const router = Router();

// POST ✅ OK
router.post('/', tokenCheck, async (req: ReqUser, res) => {

    const userid = req.user!.id;

    const { userHabits } = req.body;


    if (userHabits.length !== 10) {



        return res.status(400).json({ message: "Fill out everything!" })
    }

    // create new entries in the UsersHabits table
    try {
        for await (const userHabit of userHabits) {

            //console.log({ userHabit })

            await userHabitsDB.create(
                {
                    userid,
                    valueid: userHabit.valueid,
                    habit: userHabit.habit
                })
        }
        res.status(200).json({ message: 'habits added' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "A server errors occurred", error: error.sqlMessage });

    }
})


//PUT
router.put('/', tokenCheck, async (req: ReqUser, res) => {

    const userid = req.user!.id;

    const { userHabits } = req.body;


    if (!userHabits) {
        return res.status(400).json({ message: "Fill out everything!" })
    }

    // create new entries in the UsersHabits table
    try {
        for await (const userHabit of userHabits) {

            // console.log({ userHabit })

            await userHabitsDB.update(
                {
                    userid,
                    valueid: userHabit.valueid,
                    habit: userHabit.habit
                }, userid, userHabit.valueid)
        }
        res.status(200).json({ message: 'Updated habits' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "A server errors occurred", error: error.sqlMessage });

    }
})






export default router;