'use strict';
const { validationResult } = require('express-validator');
// catController

const { getUser, getAllUsers, insertUser, deleteUser, updateUser } = require('../models/userModel');
const { httpError } = require('../utils/error');

const user_list_get = async (req, res, next) => {
    const users = await getAllUsers();
    if(users.length > 0) {
        await users.forEach((user) => delete user.password);
        res.json(users);
        return;
    };

    const err = httpError('Users not found', 404);
    next(err);
};

const user_get = async (req, res, next) => {
    const user = await getUser(req.params.userId);
    if(user) {
        await delete user.password;
        res.json(user);
        return;
    };
    const err = httpError('Users not found', 404);
    next(err);

};

const user_post = async (req, res, next) => {
    //console.log(req.body.name);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('user_post validation', errors.array());
        const err = httpError('User is not valid', 400);
        next(err);
        return;
    }

    const id = await insertUser(req.body);
    //res.send('User added');
    res.json(id);
};
  
const user_delete = async (req, res) => {
    const deleted = await deleteUser(req.params.userId);
    //res.send(`User deleted: ${deleted}`);
    res.json(deleted);
};
  
const user_update = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('user_update validation', errors.array());
        const err = httpError('User is not valid', 400);
        next(err);
        return;
    }
    const updated = await updateUser(req.body);
    //res.send(`User updated: ${updated}`);
    res.json(updated);
};   

module.exports = {
  user_list_get,
  user_get,
  user_post,
  user_delete,
  user_update,
};
