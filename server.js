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
app.post('/api/mines', (req, res, next) => {
    const {name, location, ore} = req.body;
    console.log("Request Body Name, Location & Ore : ", name, location, ore);

    if (name && location && ore) {
      pool.query('INSERT INTO mines (name, location, ore) VALUES ($1, $2, $3) RETURNING *', [name, location, ore], (err, data) => {
        const mine = data.rows[0];
        console.log("Created Mine: ", mine);
        if (mine){
          return res.send(mine);
        } else {
          return next(err);
        }
      });

    } else {
      return res.status(400).send("Unable to create mine from request body");
    }
});

// POST request to add an ore
app.post('/api/ores', (req, res, next) => {
    const {name, rarity} = req.body;
    console.log("Request Body Name & Rarity : ", name, rarity);
    if (name && rarity) {
      pool.query('INSERT INTO ores (name, rarity) VALUES ($1, $2) RETURNING *', [name, rarity], (err, data) => {
        const ore = data.rows[0];
        console.log("Created Ore: ", ore);
        if (ore){
          return res.send(ore);
        } else {
          return next(err);
        }
      });

    } else {
      return res.status(400).send("Unable to create ore from request body");
    }
});

// PATCH request to update a mine
app.patch('/api/mines/:id', (req, res, next) => {
    const id = Number.parseInt(req.params.id);
    const {name, location, ore} = req.body;
    
    if (!Number.isInteger(id)) {
      res.status(400).send("No mine found with that ID");
    }

    console.log("Mine ID : ", id);
    
    pool.query('SELECT * FROM mines WHERE id = $1', [id], (err, result) => {
      if (err) {
        return next(err);
      }

      console.log("Request Body Name, Location and Ore : ", name, location, ore);
      const mine = result.rows[0];
      console.log("Mine ID : ", id, "Value : ", mine);

      if (!mine) {
        return res.status(404).send("No mine found with that ID");

      } else {
        const updatedName = name || mine.name; 
        const updatedLocation = location || mine.location;
        const updatedOre = ore || mine.ore;
        
        pool.query('UPDATE mines SET name=$1, location=$2, ore=$3 WHERE id = $4 RETURNING *',
         [updatedName, updatedLocation, updatedOre, id], (err, data) => {
          
          if (err){
            return next(err);
          }

          const updatedMine = data.rows[0];
          console.log("Updated Mine : ", updatedMine);
          return res.send(updatedMine);
        });
      }    
    });
  });

// DELETE request to remove a mine
app.delete("/api/mines/:id", (req, res, next) => {
    const id = Number.parseInt(req.params.id);
    if (!Number.isInteger(id)){
      return res.status(400).send("No mine found with that ID");
    }

    pool.query('DELETE FROM mines WHERE id = $1 RETURNING *', [id], (err, data) => {
      if (err){
        return next(err);
      }
      
      const deletedMine = data.rows[0];
      console.log(deletedMine);
      if (deletedMine){
        res.send(deletedMine);
      } else {
        res.status(404).send("No mine found with that ID");
      }
    });
  });

// Start server on port
app.listen(port, () => {
    console.log(`app listening on ${port}`)
});