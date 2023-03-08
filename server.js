'use strict';

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8100;

app.use(cors());
app.use(express.static('public'));
require('dotenv').config()

const DATABASE_URL = process.env.DATABASE_URL;

// Setup PG connection
const { Pool } = require('pg');
let pool = null

if (DATABASE_URL){
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
        });
        
} else {
    pool = new Pool ({
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST || '127.0.0.1',
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: 5432
    })
};

// Start routes
app.get('/api/mines', (req, res, next) => {
    pool.query('SELECT * FROM mines', (err, data) => {
        if(err) {
            return next(err)
        }

        const rows = data.rows
        console.log(rows)
        return res.send(rows)
    })
})

// Start server on port
app.listen(port, () => {
    console.log(`app listening on ${port}`)
});