require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');

// Set up the express app
const app = express();

// Passport config
require('./config/passport')(passport);

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data
app.use(cookieParser());

// Get info from html forms
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
  secret: process.env.APP_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Routes
require('./routes')(app, passport);

app.listen(process.env.PORT, function() {
  console.log(`Listening on port ${process.env.PORT}`);
});
