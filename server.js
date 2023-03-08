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

// GET request for all mines
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

// GET request for one mine
app.get('/api/mines/:id', (req, res, next) => {
    const id = Number.parseInt(req.params.id);
    if (!Number.isInteger(id)){
        res.status(404).send("No mine found with that ID");
      }
    console.log('Mine ID : ', id)
    pool.query('SELECT * FROM mines WHERE id = $1', [id], (err, data) => {
        if (err) {
            return next(err);
        }
        const mine = data.rows[0];
        console.log('Mine ID : ', id, ' Value : ', mine);
        if (mine) {
            return res.send(mine);
        } else {
            return res.status(404).send("No mine found with that ID");
        }
    })
})

// GET request for all ores
app.get('/api/ores', (req, res, next) => {
    pool.query('SELECT * FROM ores', (err, data) => {
        if(err) {
            return next(err)
        }

        const rows = data.rows
        console.log(rows)
        return res.send(rows)
    })
})

// GET request for a specific ore
app.get('/api/ores/:id', (req, res, next) => {
    const id = Number.parseInt(req.params.id);
    if (!Number.isInteger(id)){
        res.status(404).send("No ore found with that ID");
      }
    console.log('Ore ID : ', id)
    pool.query('SELECT * FROM ores WHERE id = $1', [id], (err, data) => {
        if (err) {
            return next(err);
        }
        const ore = data.rows[0];
        console.log('Ore ID : ', id, ' Value : ', ore);
        if (ore) {
            return res.send(ore);
        } else {
            return res.status(404).send("No ore found with that ID");
        }
    })
})

// POST request to add a mine

// POST request to add an ore

// PATCH request to update a mine

// DELETE request to remove a mine

// DELETE request to remove an ore from a mine

// Start server on port
app.listen(port, () => {
    console.log(`app listening on ${port}`)
});