//Includes routes related to authentication that were formerly in the "paistaApp" directory
//routes will be implemented under /api/ in serverj.js
const bcrypt = require('bcrypt');
const { User } = require('../dataAccessLayer/sequelize');
const express = require('express');
const router = express.Router
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.post('/signup', async (req, res) => {
    console.log("Signup route called")//debug
    try {
        // Extract form data from request body
        const { username, password, email, firstName, lastName } = req.body;
  
        // Log the value of hashedPassword
        console.log('Password:', password);
  
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // Create a new user using Sequelize model methods with hashed password
        const newUser = await User.create({
            username,
            hashedPassword: hashedPassword,
            email,
            firstName,
            lastName
        });

        console.log("Created user: ", username);
        res.json(newUser);
    } catch (error) {
        // Handle error (e.g., display error message)
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
  

router.post('/login', async (req, res) => {
    console.log("login route called")//debug
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
        console.log("User:", user.username, "Hashed:", user.hashedPassword);
        console.log("Password:", password, "User password:", user.password); // Testing to see if there are values
        const passwordMatch = await bcrypt.compare(password, user.hashedPassword); // Using hashedPassword gives 302
  
        if (passwordMatch) {
            // Passwords match, redirect to dashboard or homepage
            req.session.user = user.username;
            res.sendStatus(200);
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

//passport setup
passport.serializeUser((user,done) =>{
    done(null,{_id:user.id});
});

passport.deserializeUser(async (id,done) => {
    try{
        const user = await User.findByPk(id);
        done(null,user);
    }catch(err){
        console.log("Error deserializing");
        done(err);
    }
});

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try{
            const user = await User.findOne({
                where:{
                    username:username
                }
            })
            if(!user || bcrypt.compareSync(user.hashedPassword, password)){
                return done(null, user);//return all data stored in the user object
            }else{
                console.log("Attempt to login with wrong username/password");
                return done(null, false);//wrong password
            }
        }catch(err){
            done(err);
        }
        
    }
))

module.exports = router;