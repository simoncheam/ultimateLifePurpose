import { Query } from "../index";
import { LifeValues, userMetrics, userMetricsJoined, Users } from "../../types";


// get ALL userMetrics of all users
const get_all = () => Query<userMetrics[]>("SELECT * FROM UsersMetrics ");


const get_one_by_id = (id: number) => Query<userMetrics[]>("SELECT * FROM UsersMetrics WHERE userid =?", [id]);

// get all, sort by priority desc
const get_all_by_id_prioritized = (id: number) => Query<userMetrics[]>("SELECT * FROM UsersMetrics as um WHERE userid =? ORDER BY um.priority DESC ", [id]);

// ! get Joined by id by priority
const get_joined_by_id_prioritized = (userid: number) =>
    Query<userMetricsJoined[]>(" CALL spGetMetricByUserId(?) ", [userid]);

//put ✅ OK
const update = (userMetric: userMetrics, userid: Users['id'], valueid: LifeValues['id']) => Query("UPDATE UsersMetrics SET ? WHERE userid=? AND valueid=? ", [userMetric, userid, valueid]);



const create = (userMetric: userMetrics) => Query(`INSERT INTO UsersMetrics SET ?`, [userMetric]);

//delete
const destroy = (id: Users['id'], valueid: LifeValues['id']) => Query("DELETE FROM UsersMetrics WHERE userid=? AND valueid=?", [id, valueid]);



export default {
    get_all,
    get_all_by_id_prioritized,
    get_joined_by_id_prioritized,
    get_one_by_id,
    create,
    update,
    destroy

};