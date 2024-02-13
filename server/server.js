const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express()
app.use(cors())

// On the default homepage this is stored in the console
app.get('/', (re, res) => {
    return res.json("From Backend Server");
})

const connection = mysql.createConnection({
    host: "example.com",
    user: "user1",
    password: "password1",
    database: "paista_database" // Selecting the database
})


// Attempting to get user information from the SQL database however it is not working
app.get('/users', (req, res) => {
    connection.query('SELECT * FROM users', (error, results) => {
        if (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

app.listen(8081, () => {
    console.log("listening");
})