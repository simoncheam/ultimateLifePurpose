import * as mysql from 'mysql';
import { database_config } from '../config';
import { MySQL_Default_Response } from '../types';

const pool = mysql.createPool(database_config);


export const Query = <T = MySQL_Default_Response>(
    sql_string?: string, values?: unknown[]) => {


    return new Promise<T>((resolve, reject) => {

        const formatted_sql = mysql.format(sql_string, values)

        pool.query(formatted_sql, (err, results) => {

            if (err) {
                reject(err)
            } else {
                resolve(results)

            }
        })
    })
}