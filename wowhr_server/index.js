const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const con = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'Preethi*1112',
    database: 'wowhr'
});

con.connect((error) => {
    if (error) {
        console.error('Error connecting to database:', error);
    } else {
        console.log('Connected to database');
    }
});

// Add POST endpoint to save data
app.post('/save', (request, response) => {
    const { name, designation, profile_picture, linkedin_url } = request.body;

    // Insert data into the users table
    const sql = 'INSERT INTO users (name, designation, profile_picture, linkedin_url, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())';

    con.query(sql, [name, designation, profile_picture, linkedin_url], (error, result) => {
        if (error) {
            console.error('Error executing SQL query:', error);
            response.status(500).send('Error saving data');
        } else {
            response.json({ message: 'Data saved successfully' });
        }
    });
});

// Existing endpoints
app.get('/information', (request, response) => {
    const sqlQuery = 'SELECT * FROM users';
    con.query(sqlQuery, (error, result) => {
        if (error) {
            console.error('Error executing SQL query:', error);
            response.status(500).send('Error fetching data');
        } else {
            response.json(result);
        }
    });
});

app.get('/getupdate/:id', (request, response) => {
    let { id } = request.params;
    let sql = 'SELECT * FROM users WHERE id = ?';
    con.query(sql, [id], (error, result) => {
        if (error) {
            response.send(error);
        } else {
            response.send(result);
        }
    });
});

const port = 3005;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
