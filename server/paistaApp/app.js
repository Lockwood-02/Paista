var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser'); // Import body-parser middleware

const bcrypt = require('bcrypt');

// Import Sequelize models
const { sequelize, Topic, User, Post } = require('./Sequelize'); // Assuming your Sequelize setup is in a file named Sequelize.js

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set up logger middleware
app.use(logger('dev'));

// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up cookie parser middleware
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// Include the routers for index and users
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Route for handling user sign-up
app.get('/signup', (req, res) => {
    res.render('signup'); // Render the signup form
});

app.post('/signup', async (req, res) => {
  try {
      // Extract form data from request body
      const { username, hashedPassword, email, firstName, lastName } = req.body;

      // Log the value of hashedPassword
      console.log('Hashed Password:', hashedPassword);

      // Hash the password
      const hashedPasswordHashed = await bcrypt.hash(hashedPassword, 10);

      // Create a new user using Sequelize model methods with hashed password
      const newUser = await User.create({
          username,
          hashedPassword: hashedPasswordHashed, // Use hashedPasswordHashed instead of hashedPassword
          email,
          firstName,
          lastName
      });

      // Redirect to login page upon successful sign-up
      res.redirect('/login');
  } catch (error) {
      // Handle error (e.g., display error message)
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});
// Route for handling user login
app.get('/login', (req, res) => {
    res.render('login'); // Render the login form
});

app.post('/login', async (req, res) => {
  try {
      // Extract form data from request body
      const { username, password } = req.body;

      // Find the user by username
      const user = await User.findOne({ where: { username } });

      // Check if the user exists
      if (!user) {
          // User not found, handle accordingly (e.g., display error message)
          return res.status(404).send('User not found');
      }

      // Compare the hashed password from the database with the password provided
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
          // Passwords match, redirect to dashboard or homepage
          res.redirect('/dashboard');
      } else {
          // Passwords don't match, handle accordingly (e.g., display error message)
          res.status(401).send('Invalid credentials');
      }
  } catch (error) {
      // Handle error (e.g., display error message)
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});

// Define other routes for CRUD operations on other models (e.g., Topic, Post)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// Export the Express app instance
module.exports = app;