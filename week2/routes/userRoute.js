'use strict';
// userRoute

const express = require('express');
const { user_list_get, user_get, user_post } = require('../controllers/userController');

const router = express.Router();

router.get('/', user_list_get);

router.get('/:userId', user_get);

router.post('/', user_post);

router.put('/', (req, res) => {
  res.send('Put');
});

router.delete('/', (req, res) => {
  res.send('Delete');
});

module.exports = router;
