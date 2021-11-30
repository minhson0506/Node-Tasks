'use strict';

const pool = require('../database/db');
const { httpError } = require('../utils/error');
const promisePool = pool.promise();

const getAllCats = async() => {
    try {
        const [rows] = await promisePool.query(
            'SELECT wop_cat.*, wop_cat.owner, wop_user.name AS ownername FROM wop_cat LEFT JOIN wop_user ON wop_cat.owner = wop_user.user_id');
        console.log(rows);
        return rows;
    } catch (e) {
        console.error('error', e.message);
    }
};

const getCat = async(catId, next) => {
    try {
        const [row] = await promisePool.execute(
            'SELECT wop_cat.*, wop_cat.owner, wop_user.name AS ownername FROM wop_cat LEFT JOIN wop_user ON wop_cat.owner = wop_user.user_id WHERE cat_id = ?', [catId]
        );
        return row[0];
    } catch (e) {
        console.error('error', e.message);
        const err = httpError('Sql error', 500);
        next(err);
    }
};

const insertCat = async(cat) => {
    try {
        console.log(cat);
        const [row] = await promisePool.execute(
            `INSERT INTO wop_cat (name, weight, owner, birthdate, filename) VALUES (?,?,?,?,?)`, 
            [cat.name, cat.weight, cat.owner, cat.birthdate, cat.filename]
        );
        console.log(row);
        return row.insertId;
    } catch (e) {
        console.error(e.message);
    }
};

const deleteCat = async(catId, user) => {
    const cat = await getCat(catId);
    try {
        if (user.role === 0 || user.user_id === cat.owner) {
            const [rows] = await promisePool.execute(
                'DELETE FROM wop_cat WHERE cat_id = ?', [catId]
            );
            console.log(rows[0]);
            return 'deleted';
        } else
            return 'unauthenticated';
    } catch (e) {
        console.error(e.message);
    }
};

const updateCat = async(catId, cat, user) => {
    try {
        if (user.role === 0 || user.user_id === cat.owner) {
            let birthdate = cat.birthdate.toString().substring(0, 10);
            const [rows] = await promisePool.execute(
                'UPDATE wop_cat SET name = ?, weight = ?, owner = ?, birthdate =? WHERE cat_Id = ?', 
                [cat.name, cat.weight, cat.owner, birthdate, catId]
            );
            console.log('updated');
            return 'updated';
        } else {
            console.log('unauthen');
            return 'unauthenticated';
        }

    } catch (e) {
        console.error('model put cat', e.message);
    }

};

module.exports = {
    getCat,
    getAllCats,
    insertCat,
    deleteCat,
    updateCat,
};