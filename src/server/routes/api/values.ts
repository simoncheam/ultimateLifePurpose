// this is the list users can choose from

import { Router } from "express";
import valuesDB from '../../database/queries/values'
import validators from "../../utils/validators";

const router = Router();

// get all
router.get('/', async (req, res) => {

    try {
        const all_values = await valuesDB.get_all();

        res.status(200).json(all_values);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "A server errors occurred", error: error.sqlMessage });
    }

})


//get one by id

router.get('/:id', async (req, res) => {

    const id = Number(req.params.id);

    validators.isValidInteger(id)

    try {
        const [one_value] = await valuesDB.get_one_by_id(id);

        res.status(200).json(one_value);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "A server errors occurred", error: error.sqlMessage });
    }
})





// ! Query parameters

export default router;