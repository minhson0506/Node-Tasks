'use strict';
// userRoute

const express = require('express');
const { body } = require('express-validator');
const { user_list_get, user_get, user_post, user_delete, user_update, checkToken } = require('../controllers/userController');


const router = express.Router();


router.get('/token', checkToken);

router.get('/', user_list_get);

router.post('/',
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('passwd').isStrongPassword({ minLength: 8, minUpperCase: 1 }),
    user_post
);

router
    .route('/:userId')
    .get(user_get)
    .delete(user_delete)
    .put(
        body('name').isLength({ min: 3 }),
        body('email').isEmail(),
        body('password').matches('(?=.*[A-Z]).{8,}'),
        user_update
    );



module.exports = router;