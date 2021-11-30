'use strict';

const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const { getUser, getUserLogin } = require('../models/userModel');

passport.use(
    new Strategy(async(username, password, done) => {
        const params = [username];
        try {
            const [user] = await getUserLogin(params);
            console.log('Local strategy', user);

            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }

            if (user.password !== password) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, {...user }, { message: 'Logged In Successfully' });
        } catch (err) {
            return done(err);
        }
    })
);

passport.use(
    new JWTStrategy({
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'secret',
        },
        (jwtPayload, done) => {
            console.log('jwtpayload', jwtPayload);
            return done(null, jwtPayload);
        }
    )
);

module.exports = passport;