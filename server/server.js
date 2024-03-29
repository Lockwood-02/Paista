const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

//depricated with sequelize
//const dbPath = path.resolve(__dirname, '../data/database.db');
//const db = new sqlite3.Database(dbPath);
const {sequelize, Topic} = require('./dataAccessLayer/sequelize.js')//will need to include all table names in the import

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

app.use(cors({origin:"http://localhost:3000"})); //can be changed based on env variable

//synchronize to test db setup, developement only
sequelize.sync().then(() => {
    console.log('Database synced');
  }).catch(err => {
    console.error('Error syncing database:', err);
  });

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

//a copy?
app.get('/api/data', (req, res) => {
    db.all('SELECT * FROM your_table_name', (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        console.log('Data from the database:', rows); // Log the data

        res.json(rows);
    });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
