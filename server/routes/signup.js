const bcrypt = require('bcrypt');
const { Topics, Users, Posts } = require('../dataAccessLayer/sequelize');

const express = require('express');
const router = express.Router();

// Route for user signup
router.post('/signup', async (req, res) => {
    console.log("Signup route called"); // Log when the signup route is called
    try {
        // Extract form data from request body
        const { username, password, email, firstName, lastName } = req.body;

        // Log the received password
        console.log('Password:', password);

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user using Sequelize model methods with hashed password
        const newUser = await Users.create({
            username,
            hashedPassword: hashedPassword,
            email,
            firstName,
            lastName
        });

        console.log("Created user: ", username); // Log when a user is successfully created
        res.json(newUser); // Respond with the newly created user
    } catch (error) {
        // Handle error (e.g., display error message)
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;