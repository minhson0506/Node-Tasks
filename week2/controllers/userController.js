'use strict';
// catController

const { getUser, getAllUsers, insertUser, deleteUser, updateUser } = require('../models/userModel');

const user_list_get = async (req, res) => {
    const users = await getAllUsers();
    await users.forEach((user) => delete user.password);
    res.json(users);
};

const user_get = async (req, res) => {
    const user = await getUser(req.params.userId);
    await delete user.password;
    res.json(user);
};

const user_post = async (req, res) => {
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
