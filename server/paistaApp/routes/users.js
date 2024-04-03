var express = require('express');
var router = express.Router();

// Define routes for user-related operations
router.get('/', function (req, res, next) {
  res.send('Responding to GET request for users');
});

// Route for handling user sign-up
router.get('/signup', function (req, res, next) {
  res.render('signup'); // Render the signup form
});

router.post('/signup', async function (req, res, next) {
  try {
    // Extract form data from request body
    const { username, password, email, firstName, lastName } = req.body;

    // Create a new user using Sequelize model methods
    const newUser = await User.create({
      username,
      password,
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
router.get('/login', function (req, res, next) {
  res.render('login'); // Render the login form
});

router.post('/login', async function (req, res, next) {
  try {
    // Extract form data from request body
    const { username, password } = req.body;

    // Perform login authentication using Sequelize model methods
    // (Implement your authentication logic here)

    // Redirect to dashboard or homepage upon successful login
    res.redirect("localhost:3000/");
  } catch (error) {
    // Handle error (e.g., display error message)
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;