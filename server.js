
require('dotenv').config();
const express = require('express');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure the MySQL database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Test the database connection
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

// 1. Retrieve All Patients
app.get('/patients', (req, res) => {
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error retrieving patients' });
        } else {
            res.json(results);
        }
    });
});

// 2. Retrieve All Providers
app.get('/providers', (req, res) => {
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error retrieving providers' });
        } else {
            res.json(results);
        }
    });
});

// 3. Filter Patients by First Name
app.get('/patients/filter', (req, res) => {
    const { first_name } = req.query;
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
    db.query(query, [first_name], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error filtering patients by first name' });
        } else {
            res.json(results);
        }
    });
});

// 4. Retrieve All Providers by Specialty
app.get('/providers/filter', (req, res) => {
    const { specialty } = req.query;
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
    db.query(query, [specialty], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error filtering providers by specialty' });
        } else {
            res.json(results);
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
