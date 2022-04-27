const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');

const app = express();
const routeManager = require('./routes');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', routeManager);

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    status: error.status || 500,
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : ''
  });
});
module.exports = app;
