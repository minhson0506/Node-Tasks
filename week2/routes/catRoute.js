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
const { body } = require('express-validator');


const router = express.Router();

const func = (req, file, cb) => {
    if (file.mimetype.includes('image')) {
        cb(null, true);
    } else cb(null, false);
}

const upload = multer({ dest: './uploads/', fileFilter: func });

router.get('/', cat_list_get);

router.post('/',
    body('name').notEmpty(),
    body('birthdate').isDate(),
    body('weight').isNumeric().notEmpty(),
    body('owner').isNumeric().notEmpty(),
    upload.single('cat'),
    cat_post
);

router
    .route('/:catId')
    .get(cat_get)
    .delete(cat_delete)
    .put(
        body('name').notEmpty(),
        body('birthdate').isDate(),
        body('weight').isNumeric(),
        cat_update
    );

module.exports = router;