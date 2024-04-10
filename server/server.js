const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');
const cors = require('cors');

const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');

const bcrypt = require('bcrypt');

const session = require('express-session');
const sequelizeStore = require('connect-session-sequelize')(session.Store);
const topicsRouter = require('../server/routes/routerTopic.js');
const accessRouter = require('../server/routes/routerAccess.js');


const app = express();
const port = process.env.PORT || 5000;

//testing
require('dotenv').config();
const runner = require('./runTests.js');

//logging - may be removed in production
app.use(logger('dev'));

//sequelize setup
const { sequelize, Topics, Posts, Users, Accesses } = require('./dataAccessLayer/sequelize.js')//will need to include all table names in the import

//cors setup for communication with front-end
app.use(function(req, res, next){
    // This is causing an error when trying to get to the home page from the login page
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin); //TODO: This MUST be updated to the production URL
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
}) 

//allows client communication
app.use(cors({origin:"http://localhost:3000"})); //can be changed based on env variable

//parsing incoming data for easier reading
// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up cookie parser middleware
app.use(cookieParser());

// Use the topicsRouter for routes starting with /topics
app.use('/api', topicsRouter);

// Mount the access router
app.use('/api', accessRouter);

//session setup
const sessionStore = new sequelizeStore({
    db:sequelize
});

app.use(session({
    secret:"TODO: change me",
    resave:false,
    saveUninitialized:false,
    store: sessionStore
}));

sessionStore.sync();

//synchronize to test db setup, developement only
sequelize.sync().then(() => {
    console.log('Database synced');
}).catch(err => {
    console.error('Error syncing database:', err);
});

//import signup routes
const signup = require('./routes/signup.js');
app.use('/api',signup);

app.get('/api/test', async (req, res) => {
    const topics = await Topics.findAll();
    res.json(topics);
})

// Mount the access router
app.use('/api', accessRouter);

app.get('/api/data', (req, res) => {
    db.all('SELECT * FROM your_table_name', (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(rows);
    });
});

//used in testing session
app.get('/api/sessionTest', (req, res) => {
    console.log("current phrase: ", req.session.phrase);
    res.json({
        phrase: req.session.phrase ?? "default"
    });
});

app.post('/api/sessionTest', (req, res) => {
    console.log("setting phrase: ", req.body.phrase);
    req.session.phrase = req.body.phrase
    res.json(req.data);
})

app.get('/api/getUser', (req, res) => {
    res.json({username:req.session.user ?? "not_logged_in"})
});

app.post('/api/login', async (req, res) => {
    console.log("login route called")//debug
    try {
        // Extract form data from request body
        const { username, password } = req.body;
  
        // Find the user by username
        const user = await Users.findOne({ where: { username } });
  
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
app.listen(port, () => {
    console.log(`Server is running on port ${port} environment type: ${process.env.NODE_ENV}`);
    if(process.env.NODE_ENV == 'test'){
        console.log("Running tests...");
        try{
            runner.run();
        }catch(e){
            console.log("Invalid test suite: ", e);
        }
    }
});