const  {Pool} = require('pg');
require('dotenv').config();

// const pool = new Pool({
//     user: 'ahmad',
//     host: 'localhost',
//     database: 'ahmads_source_for_sports',
//     password: 'sports2023',
//     port: 5432
// })

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PW,
    port: process.env.DB_PORT
})



const getUsers = (req, res) => {
    pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
      if (error) {
        throw error;
      }
  
      res.status(200).json(results.rows);
    });
  };

module.exports = {
    getUsers
}