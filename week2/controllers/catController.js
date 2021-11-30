'use strict';
// catController

const { validationResult } = require('express-validator');

const { getCat, getAllCats, insertCat, deleteCat, updateCat } = require('../models/catModel');
const { httpError } = require('../utils/error');
const { makeThumbnail } = require('../utils/resize');
const { getCoordinates } = require('../utils/imageMeta');

const cat_list_get = async (req, res, next) => {
    const cats = await getAllCats();
    if (cats.length > 0) {
        res.json(cats);
        return;
    } else {
        const err = httpError('Cats not found', 404);
        next(err);
    }

};

const cat_get = async (req, res, next) => {
    const cat = await getCat(req.params.catId, next);
    if (cat) {
        res.json(cat);
        return;
    } else {
        const err = httpError('Cat not found', 404);
        next(err);
    }
};

const cat_post = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('cat_post validation', errors.array());
        const err = httpError('Data not valid', 400);
        next(err);
        return;
    }
    if (!req.file) {
        const err = httpError('Invalid file', 400)
        next(err);
        return;
    }

    try {
        const coords = await getCoordinates(req.file.path);
        console.log('coords', coords);
        req.body.coords = JSON.stringify(coords);
    } catch (e) {
        req.body.coords = '[24.74,60.24]';
    }

    try {
        const thumb = await makeThumbnail(req.file.path, req.file.filename);
        const cat = req.body;
        cat.fileName = req.file.filename;
        cat.owner = req.user.user_id;
        const id = await insertCat(cat);
        if (thumb) {
            res.json({ message: `Cat added with id: ${id}}` });
        }
    } catch (e) {
        console.log('cat_post error', e.message);
        const err = httpError('Error uploading cat', 400);
        next(err);
        return;
    }
};

const cat_delete = async (req, res, next) => {
    const deleted = await deleteCat(req.params.catId, req.user);
    if (deleted === 'deleted') {
        res.json(`Cat deleted: ${deleted}`);
        return;
    }

    if (deleted === 'unauthenticated') {
        next(httpError('unauthenticated user', 403));
        return;
    }

    next(httpError('Cat not found', 404));

};

const cat_update = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        console.error('cat_update validation', error.array());
        const err = httpError('Data not valid', 400);
        next(err);
        return;
    }

    const updated = await updateCat(req.params.catId, req.body, req.user);
    if (updated === 'updated') {
        res.json(`Cat updated: ${updated}`);
        return;
    }

    if (updated === 'unauthenticated') {
        next(httpError('Unauthenticated user', 403));
        return;
    }

    next(httpError('Cat not found', 404));

};

module.exports = {
    cat_list_get,
    cat_get,
    cat_post,
    cat_delete,
    cat_update
};