const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const expensesRouter = require('./routes/expenses');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  cors({
    origin: ['http://localhost:5173', 'https://render-payment-application-frontend.onrender.com'],
  })
);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', expensesRouter);

module.exports = app;