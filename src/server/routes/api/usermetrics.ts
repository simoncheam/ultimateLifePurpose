import { Router } from 'express';
import { ReqUser, userMetricsJoined } from '../../types';
import userMetricsDB from '../../database/queries/usermetrics';
import valuesDB from '../../database/queries/values';
import { tokenCheck } from '../../middleware/tokenCheck.mw';
import validators from '../../utils/validators';

const router = Router();

// get one by id from ReqUser ✅ OK
router.get('/', tokenCheck, async (req: ReqUser, res) => {
    const id = req.user!.id;

    try {
        const metricsByUserId = await userMetricsDB.get_one_by_id(id!);

        res.status(200).json(metricsByUserId);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'A server errors occurred', error: error.sqlMessage });
    }
});

// get one by id sorted by highest priority score
router.get('/prioritized', tokenCheck, async (req: ReqUser, res) => {
    const id = req.user!.id;

    try {
        const metricsByUserId = await userMetricsDB.get_all_by_id_prioritized(id!);

        res.status(200).json(metricsByUserId);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'A server errors occurred', error: error.sqlMessage });
    }
});

// joined for summary view
router.get('/summary', tokenCheck, async (req: ReqUser, res) => {
    const userid = req.user!.id;

    try {
        const [metricsByUserId] = await userMetricsDB.get_joined_by_id_prioritized(userid!);

        res.status(200).json(metricsByUserId);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'A server errors occurred', error: error.sqlMessage });
    }
});

// POST - ✅ //! STAGE 1
// ! posts a user's value into userValues list

router.post('/', tokenCheck, async (req: ReqUser, res) => {
    const userid = req.user!.id;

    const { userValueArray } = req.body;

    if (!userValueArray || userValueArray.length !== 10) {
        return res.status(400).json({ message: 'Fill out everything!' });
    }

    try {
        //async for loop
        for await (const valueid of userValueArray) {
            await userMetricsDB.create({ userid, valueid });
        }
        res.status(200).json({ message: 'values added' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'A server errors occurred', error: error.sqlMessage });
    }
});

// * Note:  multiple put request per each stage of the process

// PUT - Stage 5 - definitions
router.put('/5', tokenCheck, async (req: ReqUser, res) => {
    const userid = req.user!.id;

    const { definitions } = req.body;

    // * input validation
    if (!definitions || definitions.length != 10) {
        return res.status(400).json({ message: 'Fill out everything!' });
    }

    try {
        // check for valid strings
        let personal_defs = definitions.map((def: any) => def.personal_definition);

        for await (const userdef of definitions) {
            await validators.areValidStrings(personal_defs);

            const userMetricResults = await userMetricsDB.update(
                { userid, valueid: userdef.valueid, personal_definition: userdef.personal_definition },
                userid,
                userdef.valueid
            );
        }
        res.status(201).json({ message: 'personal definitions added to userMetric!' });
    } catch (error) {
        console.log(error);

        if ('bad_data' in error) {
            res.status(400).json({ message: error.bad_data });
        } else {
            res.status(500).json({ message: 'A server errors occurred', error: error.sqlMessage });
        }
    }
});

// PUT - Stage 6 - congruence rating

router.put('/6', tokenCheck, async (req: ReqUser, res) => {
    const userid = req.user!.id;
    const { userRatings } = req.body;

    // * input validation
    if (!userRatings || userRatings.length !== 10) {
        return res.status(400).json({ message: 'Fill out everything!' });
    }

    try {
        for await (const userRating of userRatings) {
            await validators.isValidInteger(userRating.rating);

            const userMetricResults = await userMetricsDB.update(
                {
                    userid,
                    valueid: userRating.valueid,
                    congruence_rating: userRating.rating,
                },
                userid,
                userRating.valueid
            );
        }
        res.status(201).json({ message: 'congruence ratings added to userMetric!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'A server errors occurred', error: error.sqlMessage });
    }
});

// PUT - Stage 7 - ideal state

router.put('/7', tokenCheck, async (req: ReqUser, res) => {
    const userid = req.user!.id;
    const { userIdeals } = req.body;

    // * input validation
    if (!userIdeals || userIdeals.length !== 10) {
        return res.status(400).json({ message: 'Fill out everything!' });
    }

    try {
        // stage 7

        for await (const userIdeal of userIdeals) {
            const userMetricResults = await userMetricsDB.update(
                {
                    userid,
                    valueid: userIdeal.valueid,
                    level_ten_definition: userIdeal.ideal,
                },
                userid,
                userIdeal.valueid
            );
        }
        res.status(201).json({ message: 'ideal state added to userMetric!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'A server errors occurred', error: error.sqlMessage });
    }
});

// PUT - Stage 8 - Prioritization

router.put('/8', tokenCheck, async (req: ReqUser, res) => {
    const userid = req.user!.id;
    const { userPriorities } = req.body;

    try {
        if (!userPriorities.length) {
            return res.status(400).json({ message: 'Fill out everything!' });
        }

        for await (const userPriority of userPriorities) {
            const userMetricResults = await userMetricsDB.update(
                { priority: userPriority.score },
                userid,
                userPriority.valueid
            );
        }
        res.status(201).json({ message: 'User priorities added to userMetric!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'A server errors occurred', error: error.sqlMessage });
    }
});

// PUT - Stage 9 - Definite Habits

router.put('/9', tokenCheck, async (req: ReqUser, res) => {
    const userid = req.user!.id;
    const { userHabits } = req.body;

    if (!userHabits || userHabits.length < 3) {
        return res.status(400).json({ message: 'Fill out everything!' });
    }

    try {
        for await (const userHabit of userHabits) {
            const userMetricResults = await userMetricsDB.update(
                { habit_1: userHabit.habit_1 },
                userid,
                userHabit.valueid
            );
        }
        res.status(201).json({ message: 'habit added to userMetric!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'A server errors occurred', error: error.sqlMessage });
    }
});

//DELETE ✅ OK // * this works! deletes value id off of tokenuser

router.delete('/:valueid', tokenCheck, async (req: ReqUser, res) => {
    const valueid = Number(req.params.valueid);
    const id = req.user!.id;

    try {
        const results = await userMetricsDB.destroy(id, valueid);

        res.status(200).json({ message: 'value metric Deleted' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'A server errors occurred', error: error.sqlMessage });
    }
});

export default router;
