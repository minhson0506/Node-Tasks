'use strict';
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { httpError } = require('../utils/error');

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

module.exports = {
    login
};