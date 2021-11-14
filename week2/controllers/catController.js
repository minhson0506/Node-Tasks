'use strict';
// catController

const { validationResult } = require('express-validator');

const { getCat, getAllCats, insertCat, deleteCat, updateCat } = require('../models/catModel');
const { httpError } = require('../utils/error');

const cat_list_get = async (req, res) => {
    const cats = await getAllCats();
    if (cats.length > 0){
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
    if(!req.file) {
        const err = httpError('Invalid file', 400)
        next(err);
        return;
    }
    const cat = req.body;
    cat.filename = req.file.filename;
    const id = await insertCat(cat);
    //res.send('Cat added');
    res.json({message: `Cat created with id: ${id}`, cat_id: id});
};
  
const cat_delete = async (req, res) => {
    const deleted = await deleteCat(req.params.catId);
    //res.send(`Cat deleted: ${deleted}`);
    res.json(deleted)
};
  
const cat_update = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        console.error('cat_update validation', error.array());
        const err = httpError('Data not valid', 400);
        next(err);
        return;
    }

    const updated = await updateCat(req.body);
    //res.send(`Cat updated: ${updated}`);
    res.json(updated);
};

module.exports = {
    cat_list_get,
    cat_get,
    cat_post,
    cat_delete,
    cat_update
};
