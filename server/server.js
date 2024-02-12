const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express()
app.use(cors())

// On the default homepage this is stored in the console
app.get('/', (re, res) => {
    return res.json("From Backend Server");
})

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "paista_database" // Selecting the database
})


// Attempting to get user information from the SQL database however it is not working
app.get('/users', (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.listen(8081, () => {
    console.log("listening");
})