'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();

const getAllUsers = async() => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM wop_user');
        console.log(rows)
        return rows;
    } catch (e) {
        console.error(e.message);
    }
};

const getUser = async(userId) => {
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

const insertUser = async(user) => {
    try {
        const [row] = await promisePool.execute(
            `INSERT INTO wop_user (name, email, password, role) VALUES (?,?,?,?)`, [user.name, user.email, user.passwd, user.role ? user.role : 1]
        );
        return row.insertId;
    } catch (e) {
        console.error(e.message);
    }
};

const deleteUser = async(userId, user) => {
    console.log('userid ' + userId + typeof(userId));
    console.log('user ' + user.user_id + typeof(user.user_id));
    try {
        if (user.role === 0 || user.user_id === Number(userId)) {
            const [rows] = await promisePool.execute('DELETE FROM wop_user WHERE user_id = ?', [
                userId,
            ]);
            console.log(rows);
            return 'deleted';
        } else {
            return 'unauthenticated';
        }
    } catch (e) {
        console.error(e.message);
    }

};

const updateUser = async(userId, user, userLogin) => {
    try {
        if (userLogin.role === 0 || Number(userId) === userLogin.user_id) {
            const [rows] = await promisePool.execute(
                'UPDATE wop_user SET name = ?, email = ?, password = ?, role =? WHERE user_id = ?', [user.name, user.email, user.password, user.role, userId]
            );
            console.log(rows);
            return 'updated';
        } else {
            return 'unauthenticated';
        }
    } catch (e) {
        console.error('model put cat', e.message);
    }
};

const getUserLogin = async(params) => {
    try {
        console.log(params);
        const [rows] = await promisePool.execute(
            'SELECT * FROM wop_user WHERE email = ?;',
            params
        );
        return rows;
    } catch (e) {
        console.log('error', e.message);
    }
};


module.exports = {
    getUser,
    getAllUsers,
    insertUser,
    deleteUser,
    updateUser,
    getUserLogin,
};