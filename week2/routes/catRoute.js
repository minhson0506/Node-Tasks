'use strict';
// catRoute

const express = require('express');
const {
    cat_list_get,
    cat_get,
    cat_post,
    cat_delete,
    cat_update,
} = require('../controllers/catController');

const multer = require('multer');
const upload = multer({ dest: './uploads/' });

const router = express.Router();

router.get('/', cat_list_get);

router.get('/:catId', cat_get);

router.post('/', upload.single('cat'), cat_post);

router.put('/', cat_update);

router.delete('/', cat_delete);

module.exports = router;
