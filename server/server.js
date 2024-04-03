const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');
const cors = require('cors');

const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');

const session = require('express-session');
const sequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const port = process.env.PORT || 5000;

//logging - may be removed in production
app.use(logger('dev'));

//sequelize setup
const {sequelize, Topic, User, Post} = require('./dataAccessLayer/sequelize.js')//will need to include all table names in the import

//cors setup for communication with front-end
app.use(function(req, res, next){
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin); //TODO: This MUST be updated to the production URL
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    if ('OPTIONS' == req.method) {
        res.send(200);
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
    const topics = await Topic.findAll();
    res.json(topics);
})

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


//moved from paistaApp/app.js
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
