'use strict';
// authController

const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const { httpError } = require('../utils/error');
const { insertUser } = require('../models/userModel');

const login = (req, res, next) => {
    // TODO: add passport authenticate
    passport.authenticate('local', { session: false }, (err, user, info) => {
        console.log('user passed from cb', user);
        if (err || !user) {
            return res.status(400).json({
                message: 'Incorrect email of password. Enter again.',
                user: user
            });
        }

        req.login(user, { session: false }, (err) => {
            if (err) {
                next(httpError('login error', 400));
                return;
            };

            // generate a signed son web token with the contents of user object and return it in the response
            const token = jwt.sign(user, 'secret');
            return res.json({ user, token });
        });
    })(req, res, next);
};

const user_post = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.error('user_post validation', errors.array());
        const err = httpError('data not valid', 400);
        next(err);
        return;
    }
    console.log('add user', req.body);

    try {
        req.body.passwd = bcrypt.hashSync(req.body.passwd, 12);
        const user = req.body;
        const id = await insertUser(user);
        res.json({ message: `User added with id: ${id}`, user_id: id });
    } catch (e) {
        console.log('user post error', e.message);
        const err = httpError('Error registering user', 400);
        next(err);
        return;
    }
};

module.exports = {
    login,
    user_post,
};
