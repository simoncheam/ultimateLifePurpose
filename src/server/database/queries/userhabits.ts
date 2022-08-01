import { Query } from "../index";
import { LifeValues, UserHabits, Users } from "../../types";



const create = (userHabit: UserHabits) => Query(`INSERT INTO UsersHabits SET ?`, [userHabit]);

const update = (userHabit: UserHabits, userid: Users['id'], valueid: LifeValues['id']) => Query("UPDATE UsersHabits SET ? WHERE userid=? AND valueid=? ", [userHabit, userid, valueid]);

const destroy = (id: Users['id'], valueid: LifeValues['id']) => Query("DELETE FROM UsersHabits WHERE userid=? AND valueid=?", [id, valueid]);

export default {
    create,
    update,
    destroy
};