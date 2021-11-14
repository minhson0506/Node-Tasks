'use strict';
// userRoute

const express = require('express');
const { body } = require('express-validator');
const { user_list_get, user_get, user_post, user_delete, user_update } = require('../controllers/userController');

const router = express.Router();

router.get('/', user_list_get);

router.get('/:userId', user_get);

router.post('/',
    body('name').isLength({ min: 3 }), 
    body('email').isEmail(),
    body('passwd').isStrongPassword({minLength: 8, minUpperCase: 1}),
    user_post);

router.put('/', user_update);

router.delete('/:userId', user_delete);

module.exports = router;
