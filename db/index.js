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

const query = (text, params, callback) => pool.query(text, params, callback)



module.exports = {
    query
  }