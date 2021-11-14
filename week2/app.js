'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const catRoute = require('./routes/catRoute');
const userRoute = require('./routes/userRoute');
const { httpError } = require('./utils/error');

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/cat', catRoute);
app.use('/user', userRoute);

app.use(express.json());

app.use((req, res, next) => {
    const err = httpError('Not found', 404);
    next(err);
});

app.use((err, req, res, next) => {
    const status = err.status ||500;
    res.status(status).json({ message: err.message || 'internal error'});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
