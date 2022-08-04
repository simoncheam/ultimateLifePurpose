import { Query } from '../index';
import { Users } from '../../types';

const getUserBy = (column_name: string, value: string | number) =>
  Query<Users[]>('SELECT * FROM Users WHERE ??=?', [column_name, value]);

//update users set user email, where verified =1
const update = (users: Users, id: Users['id']) =>
  Query<Users[]>('UPDATE Users SET ? WHERE id=?', [users, id]);

const create = (new_user: Users) => {
  return Query(`INSERT INTO Users SET ?`, [new_user]);
};

export default {
  getUserBy,
  create,
  update,
};
