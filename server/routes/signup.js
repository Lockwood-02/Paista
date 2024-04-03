//Includes routes related to authentication that were formerly in the "paistaApp" directory
//routes will be implemented under /api/ in serverj.js
const express = require('express');
const router = express.Router();

//routes from paistaApp/app.js

router.post('/signup', async (req, res) => {
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
  
router.post('/login', async (req, res) => {
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
  

module.exports = router;