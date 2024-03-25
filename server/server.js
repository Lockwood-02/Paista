const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

const dbPath = path.resolve(__dirname, '../data/database.db');
const db = new sqlite3.Database(dbPath);

app.get('/api/test', (req, res) => {
    res.json({sanity:"check"});
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
