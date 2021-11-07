'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();

const getAllCats = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM wop_cat');
    return rows;
  } catch (e) {
    console.error('error', e.message);
  }
};

const getCat = async (catId) => {
  try {
    const [row] = await promisePool.execute(
      'SELECT * FROM wop_cat WHERE cat_id = ?', [catId]
    );
    return row[0];
  } catch (e) {
    console.error('error', e.message);
  }
};

const insertCat = async (cat) => {
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

const deleteCat = async (catId) => {
  try {
    const [rows] = await promisePool.execute(
      'DELETE FROM wop_cat WHERE cat_id = ?',
      [catId]
    );
    return rows.affectedRows === 1;
  } catch (e) {
    console.error(e.message);
  }
};

const updateCat = async (cat) => {
  try {
    let birthdate = cat.birthdate.toString().substring(0,10);
    const [rows] = await promisePool.execute(
      'UPDATE wop_cat SET name = ?, weight = ?, owner = ?, birthdate =? WHERE cat_Id = ?',
      [cat.name, cat.weight, cat.owner, birthdate, cat.id]
    );
    return rows.affectedRows === 1;
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
