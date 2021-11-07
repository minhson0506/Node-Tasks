'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();

const getAllUsers = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM wop_user');
    return rows;
  } catch (e) {
    console.error(e.message);
  }
};

const getUser = async (userId) => {
  try {
    const [row] = await promisePool.query(
      `SELECT wu.user_id AS 'user id', wu.name AS username, wu.email AS email, wc.name as 'owned cat'
      FROM wop_cat AS wc INNER JOIN wop_user AS wu
      ON wu.user_id = wc.cat_id
      WHERE wu.user_id = ${userId}
      GROUP BY wu.name
      `
    );
    return row[0];
  } catch (e) {
    console.error(e.message);
  }
};

const insertUser = async (user) => {
  try {
    const [row] = await promisePool.execute(
      `INSERT INTO wop_user (name, email, password, role) VALUES (?,?,?,?)`,
      [user.name, user.email, user.passwd, user.role ? user.role : 1]
    );
    return row.insertId;
  } catch (e) {
    console.error(e.message);
  }
};

const deleteUser = async (userId) => {
  try {
    const [rows] = await promisePool.execute(
      'DELETE FROM wop_user WHERE user_id = ?',
      [userId]
    );
    return rows.affectedRows === 1;
  } catch (e) {
    console.error(e.message);
  }
};

const updateUser = async (user) => {
  try {
    const [rows] = await promisePool.execute(
      'UPDATE wop_user SET name = ?, email = ?, password = ?, role =? WHERE user_id = ?',
      [user.name, user.email, user.password, user.role, user.id]
    );
    return rows.affectedRows === 1;
  } catch (e) {
    console.error('model put cat', e.message);
  }
};

module.exports = {
  getUser,
  getAllUsers,
  insertUser,
  deleteUser,
  updateUser,
};
