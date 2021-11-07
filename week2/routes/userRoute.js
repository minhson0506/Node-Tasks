'use strict';
// userRoute

const express = require('express');
const { user_list_get, user_get, user_post, user_delete, user_update } = require('../controllers/userController');

const router = express.Router();

router.get('/', user_list_get);

router.get('/:userId', user_get);

router.post('/', user_post);

router.put('/', user_update);

router.delete('/:userId', user_delete);

module.exports = router;
