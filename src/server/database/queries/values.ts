import { Query } from "../index";
import { LifeValues } from "../../types"


// get all
const get_all = () => Query<LifeValues[]>("SELECT * FROM LifeValues");


// get one by id
const get_one_by_id = (id: number) => Query<LifeValues[]>("SELECT * FROM LifeValues WHERE id =?", [id]);


export default {
    get_all,
    get_one_by_id
};