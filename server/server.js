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
const postRouter = require('../server/routes/routerPost.js');
const titleHistoryRouter = require('../server/routes/routerTitleHistory.js');
const editHistoryRouter = require('../server/routes/routerEditHistory.js');
const editUserRouter = require('../server/routes/routerUser.js');
const editVoteRouter = require('../server/routes/routerVote.js');


const app = express();
const port = process.env.PORT || 5000;
const client_url = process.env.CLIENT || "http://localhost:3000";


//testing
require('dotenv').config();
const runner = require('./runTests.js');

//logging - may be removed in production
app.use(logger('dev'));

//sequelize setup
const { sequelize, Topics, Posts, Users, Accesses, EditHistories, TitleHistories } = require('./dataAccessLayer/sequelize.js')//will need to include all table names in the import

//cors setup for communication with front-end
app.use(function (req, res, next) {
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
app.use(cors({ origin: client_url })); //can be changed based on env variable

//parsing incoming data for easier reading
// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// Set up cookie parser middleware
app.use(cookieParser());

//session setup
const sessionStore = new sequelizeStore({
    db: sequelize
});

app.use(session({
    secret: "TODO: change me",
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}));

sessionStore.sync({ logging: false });

//synchronize to test db setup, developement only
sequelize.sync({ logging: false }).then(() => {
    console.log('Database synced');
}).catch(err => {
    console.error('Error syncing database:', err);
});

//import signup routes
const signup = require('./routes/signup.js');
signup(app)

//topic search route
const topicSearch = require('./routes/topicSearch.js');
app.use('/api', topicSearch);

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

app.post('/api/sessionTest', (req, res) => {
    console.log("setting phrase: ", req.body.phrase);
    req.session.phrase = req.body.phrase
    res.json(req.data);
});

app.get('/api/getUser', (req, res) => {
    //console.log("Attempting to get user: ", req.user);
    if(req.user){
        //console.log("User exits: ", req.user.username, req.user.id);
        res.json({
            username: req.user.username,
            id: req.user.id
        })
    }else{
        //console.log("user is not logged in");
        res.json({
            username:"not logged in",
            id:null
        })
    }
})

// Use the topicsRouter for routes starting with /topics
app.use('/api', topicsRouter);

// Mount the access router
app.use('/api', accessRouter);

// Mount the Posts router
app.use('/api', postRouter);

// Mount the TitleHistoy router
app.use('/api', titleHistoryRouter);

// Mount the EditHistoy router
app.use('/api', editHistoryRouter);

// Mount the User router
app.use('/api', editUserRouter);

// Mount the Vote router
app.use('/api', editVoteRouter);

//moved from paistaApp/app.js
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
    //});

    res.json({ username: req.session.user ?? "not_logged_in" })
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

// Topic Creation
app.post('/api/createTopic', async (req, res) => {
    try {
        // Extract form data from request body
        const { course, title, description } = req.body;

        // Create a new topic record in the database
        const newTopic = await Topics.create({
            // course,
            title,
            description,
            // Assuming userId is available in the session after user login
            userId: req.session.user.id // Modify this according to your user session setup
        });

        // Send a success response
        res.status(201).json(newTopic);
    } catch (error) {
        // Handle any errors that occur during topic creation
        console.error('Error creating topic:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//for testing with chai
module.exports = app;

//use this route as middleware to limit a route to authenticated users only
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.sendStatus(401);//not authenticated
};

require('./admin.js')();

app.listen(port, () => {
    console.log(`Server is running on port ${port} environment type: ${process.env.NODE_ENV}`);
    if (process.env.NODE_ENV == 'test') {
        console.log("Running tests...");
        try {
            runner.run();
        } catch (e) {
            console.log("Invalid test suite: ", e);
        }
    }
})